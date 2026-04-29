// i18n utility functions
export function getLocaleFromPath(pathname) {
  if (pathname.startsWith('/catecismo-digital/en/')) return 'en';
  if (pathname.startsWith('/en/')) return 'en';
  return 'es';
}

export function localize(path, locale) {
  const base = '/catecismo-digital';
  if (locale === 'en') {
    return `${base}/en${path}`;
  }
  return `${base}${path}`;
}

export const translations = {
  es: {
    home: 'Inicio',
    credo: 'El Credo',
    sacramentos: 'Sacramentos',
    moral: 'Moral',
    oracion: 'Oración',
    chat: 'Catequista',
  },
  en: {
    home: 'Home',
    credo: 'The Creed',
    sacramentos: 'Sacraments',
    moral: 'Moral',
    oracion: 'Prayer',
    chat: 'Catechist',
  },
};

export function t(key, locale = 'es') {
  return translations[locale]?.[key] || translations.es[key] || key;
}
