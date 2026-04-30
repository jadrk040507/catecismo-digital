/**
 * Catecismo Digital — Progress Tracker (Supabase v1)
 * 
 * Anonymous signup → JWT → Supabase (PostgREST RPC) for persistence.
 * Falls back to localStorage when offline. Auto-migrates existing data.
 * 
 * Endpoints:
 *   POST /auth/signup     — anonymous account creation
 *   POST /auth/token?grant_type=refresh_token — token refresh  
 *   POST /rest/rpc/upsert_progress — progress CRUD
 */

(function () {
  'use strict';

  // ---- Configuration ----
  var API_URL = 'https://catecismo-api.kipadmon.com';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc3NTA4ODQwfQ.BHnZVRxCzClKL5_NwdgNG_RbXIYilL_a69YLqVWkj2k';
  var STORAGE_KEY = 'cat_progress_v1';
  var AUTH_KEY = 'cat_auth_v1';
  var MIGRATED_KEY = 'cat_migrated_v1';

  // ---- Auth State ----
  var _token = null;
  var _userId = null;
  var _expiresAt = 0;
  var _ready = false;
  var _readyPromise = null;
  var _migrated = false;

  // ---- Helpers ----
  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'anon-' + Math.random().toString(36).substr(2, 9) +
           '-' + Date.now().toString(36);
  }

  function loadAuth() {
    try {
      var raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return false;
      var s = JSON.parse(raw);
      if (!s.token || !s.userId) return false;
      // Token still valid with 60s buffer
      if (s.expiresAt && Date.now() / 1000 > s.expiresAt - 60) return false;
      _token = s.token;
      _userId = s.userId;
      _expiresAt = s.expiresAt || 0;
      return true;
    } catch (e) { return false; }
  }

  function saveAuth() {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        token: _token,
        userId: _userId,
        expiresAt: _expiresAt,
        refreshToken: _refreshToken,
      }));
    } catch (e) { /* quota exceeded, silent */ }
  }

  var _refreshToken = null;
  var _migratedToAccount = false; // track whether we migrated anon→account

  function apiPost(path, body, auth) {
    var headers = {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
    };
    if (auth === undefined ? _token : auth) {
      headers['Authorization'] = 'Bearer ' + (_token || auth);
    }
    return fetch(API_URL + path, {
      method: 'POST',
      headers: headers,
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (t) {
          throw new Error(path + ' ' + r.status + ': ' + t);
        });
      }
      if (r.status === 204) return null;
      var ct = r.headers.get('content-type') || '';
      return ct.indexOf('application/json') !== -1 ? r.json() : r.text();
    });
  }

  function refreshToken() {
    if (!_refreshToken) return Promise.reject(new Error('no refresh token'));
    return apiPost('/auth/token?grant_type=refresh_token',
      { refresh_token: _refreshToken }, false
    ).then(function (data) {
      _token = data.access_token;
      _refreshToken = data.refresh_token || _refreshToken;
      _expiresAt = data.expires_in
        ? Math.floor(Date.now() / 1000) + data.expires_in
        : _expiresAt;
      saveAuth();
      return _token;
    });
  }

  /** Anonymous signup — creates a persistent anonymous account */
  function signUpAnonymously() {
    var id = generateId();
    return apiPost('/auth/signup', {
      email: id + '@catecismo.local',
      password: generateId(),
    }, false).then(function (data) {
      _token = data.access_token;
      _userId = data.user.id;
      _refreshToken = data.refresh_token;
      _expiresAt = data.expires_in
        ? Math.floor(Date.now() / 1000) + data.expires_in
        : 0;
      saveAuth();
      return { token: _token, userId: _userId };
    });
  }

  /** Ensure we have a valid auth session */
  function ensureAuth() {
    if (_readyPromise) return _readyPromise;

    _readyPromise = new Promise(function (resolve) {
      // Try cached token first
      if (loadAuth()) {
        _ready = true;
        resolve({ token: _token, userId: _userId });
        return;
      }

      // Create new anonymous account
      signUpAnonymously().then(resolve).catch(function (e) {
        console.warn('Catecismo: auth failed, using localStorage only', e);
        _ready = true; // Mark ready even without auth — localStorage fallback
        resolve({ token: null, userId: null });
      });
    });

    return _readyPromise;
  }

  /** API call with auto-refresh on 401 */
  function authPost(path, body) {
    return ensureAuth().then(function () {
      if (!_token) throw new Error('offline');
      return apiPost(path, body);
    }).catch(function (e) {
      if (e.message.indexOf('/auth/token') !== -1 ||
          e.message.indexOf('offline') !== -1) {
        throw e;
      }
      // Try refresh once
      return refreshToken().then(function () {
        return apiPost(path, body);
      });
    });
  }

  // ---- localStorage Progress (fallback + legacy) ----
  function getDefault() {
    return {
      completed: [],
      bookmarks: [],
      lastLesson: null,
      lastScroll: 0,
      lastUpdated: null,
    };
  }

  function loadLocal() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var p = JSON.parse(raw);
        var def = getDefault();
        for (var k in def) {
          if (def.hasOwnProperty(k) && !(k in p)) p[k] = def[k];
        }
        return p;
      }
    } catch (e) {}
    return getDefault();
  }

  function saveLocal(data) {
    try {
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  /**
   * Check if CatecismoAuth is loaded and user is logged in (email+password).
   * If so, we use their authenticated session instead of anonymous.
   */
  function useAuthenticatedMode() {
    return !!(window.CatecismoAuth && window.CatecismoAuth.isLoggedIn());
  }

  /**
   * Authenticated API call via CatecismoAuth.
   * Falls back to anonymous if not logged in.
   */
  function authApiPost(path, body) {
    if (useAuthenticatedMode()) {
      return window.CatecismoAuth.apiPost('/rest' + path, body);
    }
    return authPost('/rest' + path, body);
  }

  /**
   * Migrate anonymous progress into the authenticated account.
   * Called when user logs in while already having anonymous progress.
   */
  function migrateToAccount() {
    if (_migratedToAccount) return Promise.resolve();
    if (!useAuthenticatedMode()) return Promise.resolve();

    var local = loadLocal();
    if (local.completed.length === 0 && local.bookmarks.length === 0) {
      _migratedToAccount = true;
      return Promise.resolve();
    }

    var toSync = {};
    local.completed.forEach(function (p) {
      toSync[p] = toSync[p] || {};
      toSync[p].completed = true;
    });
    local.bookmarks.forEach(function (p) {
      toSync[p] = toSync[p] || {};
      toSync[p].bookmarked = true;
    });

    var paths = Object.keys(toSync);
    if (paths.length === 0) {
      _migratedToAccount = true;
      return Promise.resolve();
    }

    function syncOne(i) {
      if (i >= paths.length) {
        _migratedToAccount = true;
        return Promise.resolve();
      }
      var p = paths[i];
      var d = toSync[p];
      return authApiPost('/rpc/upsert_progress', {
        p_lesson_path: p,
        p_completed: d.completed || false,
        p_bookmarked: d.bookmarked || false,
      }).then(function () { return syncOne(i + 1); })
        .catch(function () { return syncOne(i + 1); });
    }

    return syncOne(0);
  }

  // Listen for login events to trigger migration
  if (window.CatecismoAuth) {
    window.CatecismoAuth.onAuthChange(function (event) {
      if (event.type === 'login') {
        migrateToAccount();
      }
    });
  }
  window.addEventListener('load', function () {
    if (useAuthenticatedMode()) {
      migrateToAccount();
    }
  });

  // ---- Sync: localStorage → Supabase ----
  function migrateToSupabase() {
    if (_migrated) return Promise.resolve();
    try {
      if (localStorage.getItem(MIGRATED_KEY)) {
        _migrated = true;
        return Promise.resolve();
      }
    } catch (e) {}

    var local = loadLocal();
    if (local.completed.length === 0 && local.bookmarks.length === 0) {
      _migrated = true;
      try { localStorage.setItem(MIGRATED_KEY, '1'); } catch (e) {}
      return Promise.resolve();
    }

    // Build upserts from localStorage
    var toSync = {};
    local.completed.forEach(function (p) {
      toSync[p] = toSync[p] || {};
      toSync[p].completed = true;
    });
    local.bookmarks.forEach(function (p) {
      toSync[p] = toSync[p] || {};
      toSync[p].bookmarked = true;
    });

    var paths = Object.keys(toSync);
    if (paths.length === 0) {
      _migrated = true;
      try { localStorage.setItem(MIGRATED_KEY, '1'); } catch (e) {}
      return Promise.resolve();
    }

    // Sync sequentially to avoid rate issues
    function syncOne(i) {
      if (i >= paths.length) {
        _migrated = true;
        try { localStorage.setItem(MIGRATED_KEY, '1'); } catch (e) {}
        return Promise.resolve();
      }
      var p = paths[i];
      var d = toSync[p];
      return authApiPost('/rpc/upsert_progress', {
        p_lesson_path: p,
        p_completed: d.completed || false,
        p_bookmarked: d.bookmarked || false,
      }).then(function () { return syncOne(i + 1); })
        .catch(function () { return syncOne(i + 1); }); // skip on error
    }

    return syncOne(0);
  }

  // ---- Public API (same as before for backward compat) ----

  /** @param {string} lessonPath */
  function markComplete(lessonPath) {
    var data = loadLocal();
    if (data.completed.indexOf(lessonPath) === -1) {
      data.completed.push(lessonPath);
    }
    data.lastLesson = lessonPath;
    saveLocal(data);

    // Sync to Supabase
    authApiPost('/rpc/upsert_progress', {
      p_lesson_path: lessonPath,
      p_completed: true,
    }).catch(function () {}); // silent fallback
  }

  /** @param {string} lessonPath */
  function markIncomplete(lessonPath) {
    var data = loadLocal();
    data.completed = data.completed.filter(function (p) { return p !== lessonPath; });
    saveLocal(data);

    authApiPost('/rpc/upsert_progress', {
      p_lesson_path: lessonPath,
      p_completed: false,
    }).catch(function () {});
  }

  /** @param {string} lessonPath */
  function isComplete(lessonPath) {
    return loadLocal().completed.indexOf(lessonPath) !== -1;
  }

  function getCompleted() { return loadLocal().completed; }
  function completionCount() { return loadLocal().completed.length; }

  /** @param {string} lessonPath */
  function toggleBookmark(lessonPath) {
    var data = loadLocal();
    var idx = data.bookmarks.indexOf(lessonPath);
    var nowBookmarked;
    if (idx === -1) {
      data.bookmarks.push(lessonPath);
      nowBookmarked = true;
    } else {
      data.bookmarks.splice(idx, 1);
      nowBookmarked = false;
    }
    saveLocal(data);

    authApiPost('/rpc/upsert_progress', {
      p_lesson_path: lessonPath,
      p_bookmarked: nowBookmarked,
    }).catch(function () {});

    return nowBookmarked;
  }

  /** @param {string} lessonPath */
  function isBookmarked(lessonPath) {
    return loadLocal().bookmarks.indexOf(lessonPath) !== -1;
  }

  function getBookmarks() { return loadLocal().bookmarks; }

  /** @param {string} lessonPath */
  function saveScroll(lessonPath) {
    var data = loadLocal();
    data.lastLesson = lessonPath;
    data.lastScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    saveLocal(data);

    authApiPost('/rpc/upsert_progress', {
      p_lesson_path: lessonPath,
      p_scroll_y: data.lastScroll,
    }).catch(function () {});
  }

  function getLastLesson() {
    var data = loadLocal();
    return { lesson: data.lastLesson, scroll: data.lastScroll };
  }

  function restoreScroll() {
    var path = window.location.pathname;
    var data = loadLocal();
    if (data.lastLesson === path && data.lastScroll > 0) {
      setTimeout(function () { window.scrollTo(0, data.lastScroll); }, 100);
    }
  }

  /** @param {string[]} lessonPaths */
  function getSectionStats(lessonPaths) {
    var data = loadLocal();
    var done = lessonPaths.filter(function (p) { return data.completed.indexOf(p) !== -1; });
    return {
      completed: done.length,
      total: lessonPaths.length,
      fraction: lessonPaths.length > 0 ? done.length / lessonPaths.length : 0,
    };
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(MIGRATED_KEY);
    } catch (e) {}
  }

  // Try authenticated (CatecismoAuth) first, fall back to anonymous
  function ensureAccess() {
    if (useAuthenticatedMode()) return Promise.resolve();
    if (!_token) return ensureAuth();
    return Promise.resolve();
  }

  /**
   * Load progress from Supabase into localStorage (on page load).
   * Uses authenticated mode when available, anonymous otherwise.
   */
  function syncFromSupabase() {
    return ensureAccess().then(function () {
      if (useAuthenticatedMode()) {
        return migrateToAccount();
      }
      return migrateToSupabase();
    }).then(function () {
      return authApiPost('/rpc/get_progress').catch(function () { return []; });
    }).then(function (rows) {
      if (!rows || !rows.length) return;
      var data = loadLocal();
      rows.forEach(function (r) {
        if (r.completed && data.completed.indexOf(r.lesson_path) === -1) {
          data.completed.push(r.lesson_path);
        } else if (!r.completed) {
          data.completed = data.completed.filter(function (p) { return p !== r.lesson_path; });
        }
        if (r.bookmarked && data.bookmarks.indexOf(r.lesson_path) === -1) {
          data.bookmarks.push(r.lesson_path);
        } else if (!r.bookmarked) {
          data.bookmarks = data.bookmarks.filter(function (p) { return p !== r.lesson_path; });
        }
      });
      saveLocal(data);
    }).catch(function () {
      // Offline — localStorage is the source of truth
    });
  }

  // ---- Init ----
  // Queue syncFromSupabase in background — it won't block UI
  syncFromSupabase();

  // ---- Export ----
  window.ProgressTracker = {
    markComplete: markComplete,
    markIncomplete: markIncomplete,
    isComplete: isComplete,
    getCompleted: getCompleted,
    completionCount: completionCount,
    toggleBookmark: toggleBookmark,
    isBookmarked: isBookmarked,
    getBookmarks: getBookmarks,
    saveScroll: saveScroll,
    getLastLesson: getLastLesson,
    restoreScroll: restoreScroll,
    getSectionStats: getSectionStats,
    reset: reset,
    // New methods
    syncFromSupabase: syncFromSupabase,
    ensureAuth: ensureAuth,
    getUserId: function () { return _userId; },
    isOnline: function () { return !!_token; },
  };
})();
