/**
 * Progress Tracker — Client-side lesson progress persistence via localStorage.
 * 
 * Tracks:
 * - Completed lessons (marked by user)
 * - Bookmarks (user-saved lesson references)
 * - Last viewed lesson + scroll position
 * 
 * All data is namespaced under 'cat_<version>' for cache-busting.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'cat_progress_v1';

  /** @typedef {{ completed: string[], bookmarks: string[], lastLesson: string|null, lastScroll: number, lastUpdated: string|null }} ProgressData */

  /** @returns {ProgressData} */
  function getDefault() {
    return {
      completed: [],
      bookmarks: [],
      lastLesson: null,
      lastScroll: 0,
      lastUpdated: null,
    };
  }

  /** Read progress from localStorage, falling back to defaults. */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        // Ensure all keys exist
        var def = getDefault();
        for (var k in def) {
          if (def.hasOwnProperty(k) && !(k in parsed)) {
            parsed[k] = def[k];
          }
        }
        return parsed;
      }
    } catch (e) {
      // localStorage may be unavailable or corrupt
    }
    return getDefault();
  }

  /** Persist progress data. */
  function save(data) {
    try {
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // Storage full or unavailable — silently fail
    }
  }

  /**
   * Mark a lesson as completed.
   * @param {string} lessonPath — e.g. '/catecismo-digital/es/credo/01-deseo-de-dios/'
   */
  function markComplete(lessonPath) {
    var data = load();
    if (data.completed.indexOf(lessonPath) === -1) {
      data.completed.push(lessonPath);
    }
    data.lastLesson = lessonPath;
    data.lastScroll = 0;
    save(data);
  }

  /**
   * Unmark a lesson as completed.
   * @param {string} lessonPath
   */
  function markIncomplete(lessonPath) {
    var data = load();
    data.completed = data.completed.filter(function (p) { return p !== lessonPath; });
    save(data);
  }

  /**
   * Check if a lesson is completed.
   * @param {string} lessonPath
   * @returns {boolean}
   */
  function isComplete(lessonPath) {
    return load().completed.indexOf(lessonPath) !== -1;
  }

  /**
   * Get all completed lesson paths.
   * @returns {string[]}
   */
  function getCompleted() {
    return load().completed;
  }

  /**
   * Get completion count.
   * @returns {number}
   */
  function completionCount() {
    return load().completed.length;
  }

  /**
   * Toggle a bookmark for a lesson.
   * @param {string} lessonPath
   * @returns {boolean} — true if now bookmarked, false if removed
   */
  function toggleBookmark(lessonPath) {
    var data = load();
    var idx = data.bookmarks.indexOf(lessonPath);
    if (idx === -1) {
      data.bookmarks.push(lessonPath);
      save(data);
      return true;
    } else {
      data.bookmarks.splice(idx, 1);
      save(data);
      return false;
    }
  }

  /**
   * Check if a lesson is bookmarked.
   * @param {string} lessonPath
   * @returns {boolean}
   */
  function isBookmarked(lessonPath) {
    return load().bookmarks.indexOf(lessonPath) !== -1;
  }

  /**
   * Get all bookmarked lesson paths.
   * @returns {string[]}
   */
  function getBookmarks() {
    return load().bookmarks;
  }

  /**
   * Save the current scroll position for a lesson.
   * @param {string} lessonPath
   */
  function saveScroll(lessonPath) {
    var data = load();
    data.lastLesson = lessonPath;
    data.lastScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    save(data);
  }

  /**
   * Get the last viewed lesson info.
   * @returns {{ lesson: string|null, scroll: number }}
   */
  function getLastLesson() {
    var data = load();
    return { lesson: data.lastLesson, scroll: data.lastScroll };
  }

  /**
   * Restore scroll position for the current lesson (if stored).
   * Clears the scroll position after restoring to avoid re-triggers.
   */
  function restoreScroll() {
    var path = window.location.pathname;
    var data = load();
    if (data.lastLesson === path && data.lastScroll > 0) {
      setTimeout(function () {
        window.scrollTo(0, data.lastScroll);
        // Don't clear so user can refresh and still get position
      }, 100);
    }
  }

  /**
   * Get completion stats for a list of lesson paths.
   * @param {string[]} lessonPaths
   * @returns {{ completed: number, total: number, fraction: number }}
   */
  function getSectionStats(lessonPaths) {
    var data = load();
    var completed = lessonPaths.filter(function (p) { return data.completed.indexOf(p) !== -1; });
    return {
      completed: completed.length,
      total: lessonPaths.length,
      fraction: lessonPaths.length > 0 ? completed.length / lessonPaths.length : 0,
    };
  }

  /** Reset all progress data. */
  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  // Export via global namespace for inline script access
  window.ProgressTracker = {
    load: load,
    save: save,
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
  };
})();
