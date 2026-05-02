import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://catecismo.kipadmon.com',
  base: '/',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    format: 'directory',
  },
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'es',
      locales: { es: 'es-MX', en: 'en-US' }
    }
  })]
});
