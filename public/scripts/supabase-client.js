/**
 * Catecismo Digital — Auth Client v2
 * 
 * Vanilla JS auth module using GoTrue (Supabase self-hosted auth).
 * Provides CatecismoAuth global for login, signup, session management.
 * Integrates with ProgressTracker for authenticated progress tracking.
 *
 * API: https://catecismo-api.kipadmon.com
 * GoTrue: /auth/* endpoints
 * PostgREST: /rest/*
 */
(function () {
  'use strict';

  var API_URL = 'https://catecismo-api.kipadmon.com';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc3NTA4ODQwfQ.BHnZVRxCzClKL5_NwdgNG_RbXIYilL_a69YLqVWkj2k';
  var STORAGE_KEY = 'cat_auth_v2';

  var _token = null;
  var _refreshToken = null;
  var _user = null;
  var _profile = null;
  var _expiresAt = 0;
  var _listeners = [];

  // ---- Helpers ----

  function saveSession() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        token: _token,
        refreshToken: _refreshToken,
        user: _user,
        profile: _profile,
        expiresAt: _expiresAt,
      }));
    } catch (e) { /* ignore */ }
  }

  function clearSession() {
    _token = null;
    _refreshToken = null;
    _user = null;
    _profile = null;
    _expiresAt = 0;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function loadSession() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var s = JSON.parse(raw);
      if (!s.token) return false;
      if (s.expiresAt && Date.now() / 1000 > s.expiresAt - 60) {
        // Token expired, but we have a refresh token — try to refresh
        if (s.refreshToken) {
          _refreshToken = s.refreshToken;
          _user = s.user;
          _profile = s.profile;
          return 'refresh'; // signal to refresh
        }
        return false;
      }
      _token = s.token;
      _refreshToken = s.refreshToken || null;
      _user = s.user || null;
      _profile = s.profile || null;
      _expiresAt = s.expiresAt || 0;
      return true;
    } catch (e) { return false; }
  }

  /** Fetch helper for GoTrue auth endpoints (no auth header, uses apikey) */
  function authFetch(path, method, body) {
    var headers = {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
    };
    return fetch(API_URL + path, {
      method: method || 'POST',
      headers: headers,
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (t) {
          var msg;
          try {
            var j = JSON.parse(t);
            msg = j.error_description || j.msg || j.message || t;
          } catch (e) { msg = t; }
          throw new Error(msg);
        });
      }
      if (r.status === 204) return null;
      var ct = r.headers.get('content-type') || '';
      return ct.indexOf('application/json') !== -1 ? r.json() : r.text();
    });
  }

  /** Authenticated fetch (uses bearer token) */
  function apiFetch(path, method, body) {
    var headers = {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
    };
    if (_token) {
      headers['Authorization'] = 'Bearer ' + _token;
    }
    return fetch(API_URL + path, {
      method: method || 'GET',
      headers: headers,
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      if (r.status === 401 && _refreshToken) {
        // Attempt refresh and retry once
        return refreshSessionInternal().then(function (newToken) {
          headers['Authorization'] = 'Bearer ' + newToken;
          return fetch(API_URL + path, {
            method: method || 'GET',
            headers: headers,
            body: body ? JSON.stringify(body) : undefined,
          });
        });
      }
      if (!r.ok) {
        return r.text().then(function (t) {
          var msg;
          try { msg = JSON.parse(t).message || t; } catch (e) { msg = t; }
          throw new Error(msg);
        });
      }
      if (r.status === 204) return null;
      var ct = r.headers.get('content-type') || '';
      return ct.indexOf('application/json') !== -1 ? r.json() : r.text();
    });
  }

  /** Internal refresh — returns new token */
  function refreshSessionInternal() {
    if (!_refreshToken) return Promise.reject(new Error('No refresh token'));
    return authFetch('/auth/token?grant_type=refresh_token', 'POST', {
      refresh_token: _refreshToken,
    }).then(function (data) {
      _token = data.access_token;
      _refreshToken = data.refresh_token || _refreshToken;
      _expiresAt = data.expires_in
        ? Math.floor(Date.now() / 1000) + data.expires_in
        : Math.floor(Date.now() / 1000) + 3600;
      saveSession();
      return _token;
    });
  }

  function emit(type) {
    _listeners.forEach(function (cb) {
      try { cb({ type: type, user: _user, profile: _profile }); } catch (e) {}
    });
  }

  /** Migrate legacy cat_auth_v1 → cat_auth_v2 */
  function migrateLegacy() {
    try {
      var v1Raw = localStorage.getItem('cat_auth_v1');
      if (v1Raw) {
        var v1 = JSON.parse(v1Raw);
        if (v1.token && v1.userId) {
          // Legacy was anonymous — just store as v2 format so we know it exists
          // Don't overwrite if v2 already exists
          if (!localStorage.getItem(STORAGE_KEY)) {
            _token = v1.token;
            _user = { id: v1.userId, anonymous: true };
            _refreshToken = v1.refreshToken || null;
            _expiresAt = v1.expiresAt || 0;
            saveSession();
          }
        }
      }
    } catch (e) { /* ignore */ }
  }

  // ---- Public API ----

  /**
   * Login with email + password.
   * POST /auth/token?grant_type=password
   */
  function login(email, password) {
    return authFetch('/auth/token?grant_type=password', 'POST', {
      email: email,
      password: password,
      gotrue_meta_security: {},
    }).then(function (data) {
      _token = data.access_token;
      _refreshToken = data.refresh_token;
      _user = data.user;
      _expiresAt = data.expires_in
        ? Math.floor(Date.now() / 1000) + data.expires_in
        : Math.floor(Date.now() / 1000) + 3600;

      // Fetch profile
      return apiFetch('/rest/profiles?id=eq.' + _user.id, 'GET').then(function (profiles) {
        _profile = (profiles && profiles.length > 0) ? profiles[0] : null;
        saveSession();
        emit('login');
        return _user;
      }).catch(function () {
        // Profile fetch failed — still save session
        _profile = null;
        saveSession();
        emit('login');
        return _user;
      });
    });
  }

  /**
   * Sign up a new user.
   * POST /auth/signup → creates auth account
   * POST /rest/profiles → creates profile row
   * Then auto-login with the returned session.
   */
  function signup(email, password, fullName) {
    return authFetch('/auth/signup', 'POST', {
      email: email,
      password: password,
    }).then(function (data) {
      // GoTrue auto-returns a session on signup (if email confirmation is disabled)
      if (data.access_token) {
        _token = data.access_token;
        _refreshToken = data.refresh_token;
        _user = data.user;
        _expiresAt = data.expires_in
          ? Math.floor(Date.now() / 1000) + data.expires_in
          : Math.floor(Date.now() / 1000) + 3600;
      } else if (data.user) {
        // Got user but no session — need to login
        _user = data.user;
        return login(email, password).then(function () {
          return createProfile(fullName).then(function () { return _user; });
        });
      }

      // Create profile
      return apiFetch('/rest/profiles', 'POST', {
        id: _user.id,
        email: email,
        full_name: fullName,
        role: 'user',
      }).then(function () {
        _profile = { id: _user.id, email: email, full_name: fullName, role: 'user' };
        saveSession();
        emit('login');
        return _user;
      }).catch(function (e) {
        // Profile may already exist or creation failed — try fetch
        return apiFetch('/rest/profiles?id=eq.' + _user.id, 'GET').then(function (profiles) {
          _profile = (profiles && profiles.length > 0) ? profiles[0] : null;
          saveSession();
          emit('login');
          return _user;
        }).catch(function () {
          _profile = null;
          saveSession();
          emit('login');
          return _user;
        });
      });
    });
  }

  /** Helper: create profile via REST API */
  function createProfile(fullName) {
    return apiFetch('/rest/profiles', 'POST', {
      id: _user.id,
      email: _user.email,
      full_name: fullName,
      role: 'user',
    });
  }

  /** Logout — invalidates the current session */
  function logout() {
    var tokenToExpire = _token;
    if (tokenToExpire) {
      // Try to call logout endpoint (fire and forget)
      authFetch('/auth/logout', 'POST', {}).catch(function () {});
    }
    clearSession();
    emit('logout');
    return Promise.resolve();
  }

  /** Get current session from memory/storage */
  function getSession() {
    if (_token && _user) {
      return { token: _token, user: _user, profile: _profile };
    }
    var loaded = loadSession();
    if (loaded === true) {
      return { token: _token, user: _user, profile: _profile };
    }
    if (loaded === 'refresh') {
      refreshSessionInternal().catch(function () {});
      return null;
    }
    return null;
  }

  /** Fetch profile from server */
  function getProfile() {
    if (!_token || !_user) return Promise.resolve(null);
    return apiFetch('/rest/profiles?id=eq.' + _user.id, 'GET').then(function (profiles) {
      _profile = (profiles && profiles.length > 0) ? profiles[0] : null;
      saveSession();
      return _profile;
    });
  }

  /** Refresh the current session (public API) */
  function refreshSession() {
    return refreshSessionInternal().then(function () {
      // Re-fetch profile to update role, etc.
      return getProfile().then(function () {
        emit('login');
        return { token: _token, user: _user, profile: _profile };
      });
    });
  }

  /**
   * Authenticated API call helper.
   * Handles 401 auto-refresh transparently.
   * @param {string} path - API path relative to API_URL (e.g. '/rest/rpc/func')
   * @param {object} body - Request body (will be JSON.stringified)
   * @param {string} method - HTTP method (default POST)
   */
  function apiPost(path, body, method) {
    return apiFetch(path, method || 'POST', body);
  }

  /** Check if user is logged in with a real account */
  function isLoggedIn() {
    return !!(_token && _user && _profile && !_user.anonymous);
  }

  /** Check if current user is admin or super_admin */
  function isAdmin() {
    if (!_profile) return false;
    return _profile.role === 'admin' || _profile.role === 'super_admin';
  }

  /** Check if current user is super_admin */
  function isSuperAdmin() {
    return _profile && _profile.role === 'super_admin';
  }

  /**
   * Register an auth state change listener.
   * @param {function} callback - receives { type: 'login'|'logout', user, profile }
   */
  function onAuthChange(callback) {
    _listeners.push(callback);
    // Immediately call with current state
    if (isLoggedIn()) {
      try { callback({ type: 'login', user: _user, profile: _profile }); } catch (e) {}
    }
  }

  /** Initialize — load stored session, migrate legacy, refresh if needed */
  function init() {
    var state = loadSession();
    if (state === 'refresh') {
      refreshSessionInternal().then(function () {
        return getProfile();
      }).then(function () {
        emit('login');
      }).catch(function () {
        clearSession(); // Refresh failed, clear stale data
      });
    } else if (state === true) {
      // Session loaded — verify by fetching profile (updates role if changed)
      getProfile().catch(function () {});

      // If we have a profile from cache, emit login so UI updates
      if (_profile) {
        emit('login');
      }
    }

    // Migrate legacy v1 auth
    migrateLegacy();
  }

  // ---- Export ----
  window.CatecismoAuth = {
    login: login,
    signup: signup,
    logout: logout,
    getSession: getSession,
    getProfile: getProfile,
    refreshSession: refreshSession,
    apiPost: apiPost,
    isLoggedIn: isLoggedIn,
    isAdmin: isAdmin,
    isSuperAdmin: isSuperAdmin,
    onAuthChange: onAuthChange,
    init: init,
  };

  // Auto-init
  init();

})();
