/**
 * Continue banner — shows "Continue where you left off" on the homepage.
 * Hydrates from localStorage via ProgressTracker.
 */
(function() {
  'use strict';
  // Wait for ProgressTracker to load
  if (!window.ProgressTracker) return;

  var last = window.ProgressTracker.getLastLesson();
  if (!last || !last.lesson) return;

  // Don't show if the lesson URL matches current page (already on it)
  if (last.lesson === window.location.pathname) return;

  // Extract a readable title from the URL
  var parts = last.lesson.replace(/\/$/,'').split('/');
  var slug = parts[parts.length - 1] || '';
  // Convert slug to title: '01-deseo-de-dios' → '1. El Deseo de Dios'
  var title = slug
    .replace(/^(\d+)-/, function(_, num) { return parseInt(num, 10) + '. '; })
    .replace(/-/g, ' ')
    .replace(/\b\w/g, function(c) { return c.toUpperCase(); });
  
  // Determine language for button text
  var isEn = document.documentElement.getAttribute('data-is-en') === 'true';
  var btnText = isEn ? 'Continue →' : 'Continuar →';
  var bannerText = isEn
    ? 'You were reading:'
    : 'Estabas leyendo:';

  // Find the hero section and inject banner
  var hero = document.querySelector('.hero');
  if (!hero) return;

  var banner = document.createElement('div');
  banner.className = 'continue-banner';
  banner.innerHTML =
    '<div class="continue-banner__inner">' +
      '<div class="continue-banner__info">' +
        '<span class="continue-banner__label">' + bannerText + '</span>' +
        '<span class="continue-banner__title">' + title + '</span>' +
      '</div>' +
      '<a href="' + last.lesson + '" class="continue-banner__btn">' + btnText + '</a>' +
    '</div>';
  
  hero.parentNode.insertBefore(banner, hero.nextSibling);
})();
