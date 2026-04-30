/**
 * Catecismo Digital — Auth UI
 * 
 * Handles the header auth button and user dropdown.
 * Uses window.CatecismoAuth for auth state.
 */
(function () {
  'use strict';

  function getLang() {
    // Check data-lang attribute on html
    var htmlLang = document.documentElement.getAttribute('data-lang');
    if (htmlLang === 'en') return 'en';
    return 'es';
  }

  var L = {
    es: {
      login: 'Ingresar',
      logout: 'Cerrar sesión',
      progress: 'Mi Progreso',
      dashboard: 'Dashboard',
    },
    en: {
      login: 'Login',
      logout: 'Log out',
      progress: 'My Progress',
      dashboard: 'Dashboard',
    },
  };

  function t(key, lang) {
    lang = lang || getLang();
    return (L[lang] && L[lang][key]) || L.es[key] || key;
  }

  var authBtn = null;
  var dropdownEl = null;

  // Add auth styles
  function injectStyles() {
    if (document.getElementById('auth-ui-styles')) return;
    var style = document.createElement('style');
    style.id = 'auth-ui-styles';
    style.textContent = [
      '.auth-btn {',
      '  display: inline-flex; align-items: center; gap: 8px;',
      '  padding: 4px 14px; border: 1px solid var(--border);',
      '  border-radius: 20px; background: var(--bg-card);',
      '  cursor: pointer; font-family: var(--sans); font-size: .8rem;',
      '  color: var(--text-soft); text-decoration: none;',
      '  transition: all .2s; white-space: nowrap; position: relative;',
      '}',
      '.auth-btn:hover { border-color: var(--accent); color: var(--accent); }',
      '.auth-btn__avatar {',
      '  width: 24px; height: 24px; border-radius: 50%;',
      '  background: var(--accent); color: white;',
      '  display: flex; align-items: center; justify-content: center;',
      '  font-size: .7rem; font-weight: 600; flex-shrink: 0;',
      '}',
      '.auth-btn__name { max-width: 100px; overflow: hidden; text-overflow: ellipsis; }',
      '.auth-dropdown {',
      '  display: none; position: absolute; top: calc(100% + 8px); right: 0;',
      '  background: var(--bg-card); border: 1px solid var(--border);',
      '  border-radius: var(--radius); box-shadow: 0 4px 16px rgba(0,0,0,.08);',
      '  min-width: 180px; z-index: 120; padding: 6px 0;',
      '}',
      '.auth-dropdown--open { display: block; }',
      '.auth-dropdown a, .auth-dropdown button {',
      '  display: block; width: 100%; text-align: left; padding: 8px 16px;',
      '  border: none; background: none; cursor: pointer;',
      '  font-family: var(--sans); font-size: .82rem; color: var(--text);',
      '  text-decoration: none; transition: background .15s;',
      '}',
      '.auth-dropdown a:hover, .auth-dropdown button:hover { background: var(--gold-light); }',
      '.auth-dropdown__divider {',
      '  height: 1px; background: var(--border); margin: 4px 0;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function getInitial(name) {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }

  function buildLoggedOutUI(lang) {
    var label = t('login', lang);
    return '<span>' + label + '</span>';
  }

  function buildLoggedInUI(profile, lang) {
    var name = (profile && profile.full_name) || '';
    var initial = getInitial(name);
    var displayName = name || (profile && profile.email) || '';
    if (displayName.length > 15) {
      displayName = displayName.substring(0, 14) + '…';
    }
    var dashboardHtml = '';
    if (window.CatecismoAuth && window.CatecismoAuth.isAdmin()) {
      dashboardHtml = '<a href="/dashboard/">' + t('dashboard', lang) + '</a>' +
        '<div class="auth-dropdown__divider"></div>';
    }
    return [
      '<span class="auth-btn__avatar">' + initial + '</span>',
      '<span class="auth-btn__name">' + displayName + '</span>',
    ].join('');
  }

  function buildDropdownHTML(lang) {
    var dashboardHtml = '';
    if (window.CatecismoAuth && window.CatecismoAuth.isAdmin()) {
      dashboardHtml = '<a href="/dashboard/">' + t('dashboard', lang) + '</a>' +
        '<div class="auth-dropdown__divider"></div>';
    }
    return [
      '<a href="/es/perfil/">' + t('progress', lang) + '</a>',
      dashboardHtml,
      '<button type="button" data-auth-logout>' + t('logout', lang) + '</button>',
    ].join('');
  }

  function updateUI() {
    if (!authBtn) return;

    var lang = getLang();
    var isLoggedIn = window.CatecismoAuth && window.CatecismoAuth.isLoggedIn();

    // Clear existing content
    authBtn.innerHTML = '';

    if (isLoggedIn) {
      var sess = window.CatecismoAuth.getSession();
      var profile = sess ? sess.profile : null;
      authBtn.innerHTML = buildLoggedInUI(profile, lang);
      authBtn.classList.add('auth-btn--logged-in');

      // Create dropdown
      if (!dropdownEl) {
        dropdownEl = document.createElement('div');
        dropdownEl.className = 'auth-dropdown';
        authBtn.appendChild(dropdownEl);
      }
      dropdownEl.innerHTML = buildDropdownHTML(lang);

      // Logout handler
      dropdownEl.querySelector('[data-auth-logout]').addEventListener('click', function (e) {
        e.stopPropagation();
        window.CatecismoAuth.logout().then(function () {
          dropdownEl.classList.remove('auth-dropdown--open');
        });
      });
    } else {
      authBtn.innerHTML = buildLoggedOutUI(lang);
      authBtn.classList.remove('auth-btn--logged-in');
      if (dropdownEl) {
        dropdownEl.remove();
        dropdownEl = null;
      }
    }
  }

  function onToggleClick(e) {
    e.stopPropagation();
    var isLoggedIn = window.CatecismoAuth && window.CatecismoAuth.isLoggedIn();
    if (!isLoggedIn) {
      // Navigate to login page
      var lang = getLang();
      var loginPath = lang === 'en' ? '/en/login/' : '/login/';
      window.location.href = loginPath;
      return;
    }
    if (!dropdownEl) return;
    var isOpen = dropdownEl.classList.contains('auth-dropdown--open');
    if (isOpen) {
      dropdownEl.classList.remove('auth-dropdown--open');
    } else {
      dropdownEl.classList.add('auth-dropdown--open');
    }
  }

  function onOutsideClick(e) {
    if (dropdownEl && dropdownEl.classList.contains('auth-dropdown--open')) {
      if (!authBtn.contains(e.target)) {
        dropdownEl.classList.remove('auth-dropdown--open');
      }
    }
  }

  function init() {
    injectStyles();

    // Find the header links container
    var headerLinks = document.querySelector('.header__links');
    if (!headerLinks) return;

    // Create auth button
    authBtn = document.createElement('div');
    authBtn.className = 'auth-btn';
    authBtn.setAttribute('role', 'button');
    authBtn.setAttribute('tabindex', '0');

    // Insert before the lang toggle
    var langBtn = headerLinks.querySelector('.header__link--lang');
    if (langBtn) {
      headerLinks.insertBefore(authBtn, langBtn);
    } else {
      headerLinks.appendChild(authBtn);
    }

    // Toggle dropdown on click
    authBtn.addEventListener('click', onToggleClick);

    // Close on outside click
    document.addEventListener('click', onOutsideClick);

    // Listen for auth changes
    if (window.CatecismoAuth) {
      window.CatecismoAuth.onAuthChange(function (event) {
        updateUI();
      });
    }

    // Initial render
    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
