/**
 * Catecismo Digital — Auth UI
 * 
 * Handles the header auth button and user dropdown.
 * Matches header__link--lang visual style.
 * Uses window.CatecismoAuth for auth state.
 */
(function () {
  'use strict';

  function getLang() {
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
  var lang = null;

  function injectStyles() {
    if (document.getElementById('auth-ui-styles')) return;
    var style = document.createElement('style');
    style.id = 'auth-ui-styles';
    style.textContent = [
      '.header__link--auth { position: relative; cursor: pointer; user-select: none; }',
      '.header__link--auth--logged-in { display: inline-flex; align-items: center; gap: 6px; }',
      '.header__auth-avatar {',
      '  width: 20px; height: 20px; border-radius: 50%;',
      '  background: var(--accent); color: #fff;',
      '  display: flex; align-items: center; justify-content: center;',
      '  font-size: .65rem; font-weight: 700; flex-shrink: 0; line-height: 1;',
      '}',
      '.header__auth-name { max-width: 90px; overflow: hidden; text-overflow: ellipsis; }',
      '.header__auth-dropdown {',
      '  display: none; position: absolute; top: calc(100% + 6px); right: 0;',
      '  background: var(--bg-card); border: 1px solid var(--border);',
      '  border-radius: var(--radius); box-shadow: 0 4px 16px rgba(0,0,0,.10);',
      '  min-width: 180px; z-index: 120; padding: 4px 0;',
      '}',
      '.header__auth-dropdown--open { display: block; }',
      '.header__auth-dropdown a, .header__auth-dropdown button {',
      '  display: block; width: 100%; text-align: left; padding: 8px 16px;',
      '  border: none; background: none; cursor: pointer;',
      '  font-family: inherit; font-size: .82rem; color: var(--text);',
      '  text-decoration: none; transition: background .15s;',
      '}',
      '.header__auth-dropdown a:hover, .header__auth-dropdown button:hover { background: var(--gold-light); }',
      '.header__auth-dropdown-divider {',
      '  height: 1px; background: var(--border); margin: 4px 0;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function getInitial(name) {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }

  function updateUI() {
    if (!authBtn) return;
    lang = getLang();
    var isLoggedIn = window.CatecismoAuth && window.CatecismoAuth.isLoggedIn();

    if (isLoggedIn) {
      var sess = window.CatecismoAuth.getSession();
      var profile = sess ? sess.profile : null;
      var name = (profile && profile.full_name) || (profile && profile.email) || '';
      if (name.length > 15) name = name.substring(0, 14) + '\u2026';
      var initial = getInitial(profile && profile.full_name);

      // Show avatar + name
      authBtn.innerHTML = '<span class="header__auth-avatar">' + initial + '</span>' +
        '<span class="header__auth-name">' + name + '</span>';
      authBtn.classList.add('header__link--auth--logged-in');

      // Create dropdown
      if (!dropdownEl) {
        dropdownEl = document.createElement('div');
        dropdownEl.className = 'header__auth-dropdown';
        authBtn.appendChild(dropdownEl);
      }

      var dash = '';
      if (window.CatecismoAuth.isAdmin()) {
        dash = '<a href="/dashboard/">' + t('dashboard', lang) + '</a>' +
          '<div class="header__auth-dropdown-divider"></div>';
      }
      dropdownEl.innerHTML = dash +
        '<a href="/es/perfil/">' + t('progress', lang) + '</a>' +
        '<div class="header__auth-dropdown-divider"></div>' +
        '<button type="button" data-auth-logout>' + t('logout', lang) + '</button>';

      dropdownEl.querySelector('[data-auth-logout]').addEventListener('click', function (e) {
        e.stopPropagation();
        window.CatecismoAuth.logout().then(function () {
          dropdownEl.classList.remove('header__auth-dropdown--open');
        });
      });
    } else {
      authBtn.innerHTML = t('login', lang);
      authBtn.classList.remove('header__link--auth--logged-in');
      if (dropdownEl) { dropdownEl.remove(); dropdownEl = null; }
    }
  }

  function onToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    var isLoggedIn = window.CatecismoAuth && window.CatecismoAuth.isLoggedIn();
    if (!isLoggedIn) {
      var loginPath = getLang() === 'en' ? '/en/login/' : '/login/';
      window.location.href = loginPath;
      return;
    }
    if (!dropdownEl) return;
    var isOpen = dropdownEl.classList.contains('header__auth-dropdown--open');
    if (isOpen) {
      dropdownEl.classList.remove('header__auth-dropdown--open');
    } else {
      dropdownEl.classList.add('header__auth-dropdown--open');
    }
  }

  function onOutsideClick(e) {
    if (dropdownEl && dropdownEl.classList.contains('header__auth-dropdown--open')) {
      if (!authBtn.contains(e.target)) {
        dropdownEl.classList.remove('header__auth-dropdown--open');
      }
    }
  }

  function init() {
    injectStyles();

    var headerLinks = document.querySelector('.header__links');
    if (!headerLinks) return;

    authBtn = document.createElement('a');
    authBtn.className = 'header__link header__link--lang header__link--auth';
    authBtn.setAttribute('role', 'button');
    authBtn.setAttribute('tabindex', '0');
    authBtn.href = '#';

    var targetEl = document.querySelector('.header__actions');
    if (!targetEl) {
      targetEl = document.createElement('div');
      targetEl.className = 'header__actions';
      headerLinks.parentNode.insertBefore(targetEl, headerLinks.nextSibling || headerLinks);
    }

    var langBtn = targetEl.querySelector('.header__link--lang');
    if (langBtn) {
      targetEl.insertBefore(authBtn, langBtn);
    } else {
      targetEl.appendChild(authBtn);
    }

    authBtn.addEventListener('click', onToggleClick);
    document.addEventListener('click', onOutsideClick);

    if (window.CatecismoAuth) {
      window.CatecismoAuth.onAuthChange(function () { updateUI(); });
    }

    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
