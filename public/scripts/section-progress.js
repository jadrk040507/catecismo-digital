/**
 * Section Index Progress — adds progress bar and completion checkmarks to section index pages.
 * Hydrates from localStorage via ProgressTracker.
 */
(function() {
  'use strict';
  if (!window.ProgressTracker) return;

  // Only run on section index pages (pages with lesson links)
  var lessonContainer = document.querySelector('[data-progress-section]');
  if (!lessonContainer) return;

  // Collect all lesson links in the container
  var lessonLinks = lessonContainer.querySelectorAll('a[href*="/catecismo-digital/"]');
  var lessonPaths = [];
  var linkElements = [];

  lessonLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    // Only include direct lesson pages (not workbooks/guides), normalize with trailing slash
    var clean = href.replace(/\/$/,'');
    if (clean.match(/-\d{2}-/) && !clean.match(/-(workbook|guide)$/)) {
      var path = clean + '/';
      lessonPaths.push(path);
      linkElements.push({ el: link, path: path });
    }
  });

  if (lessonPaths.length === 0) return;

  // ---- Progress bar ----
  var stats = window.ProgressTracker.getSectionStats(lessonPaths);
  var isEn = document.documentElement.getAttribute('data-is-en') === 'true';

  var barWrap = document.createElement('div');
  barWrap.className = 'progress-bar-wrap';
  barWrap.innerHTML =
    '<div class="progress-bar">' +
      '<div class="progress-bar__fill" style="width:' + Math.round(stats.fraction * 100) + '%"></div>' +
    '</div>' +
    '<span class="progress-bar__label">' + stats.completed + '/' + stats.total + ' (' + Math.round(stats.fraction * 100) + '%)</span>';

  lessonContainer.parentNode.insertBefore(barWrap, lessonContainer);

  // ---- Completion checkmarks on lesson links ----
  linkElements.forEach(function(item) {
    var done = window.ProgressTracker.isComplete(item.path);
    if (done) {
      item.el.classList.add('lesson-link--done');
      var check = document.createElement('span');
      check.className = 'index-lesson-check';
      check.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" fill="var(--accent)" stroke="var(--accent)"/><path d="M9 12l2 2 4-4" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      item.el.appendChild(check);
    }
  });
})();
