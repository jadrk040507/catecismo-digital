import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://jadrk040507.github.io/catecismo-digital',
  base: '/catecismo-digital',
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
  output: 'server',
  integrations: [svelte()],
  adapter: node({
    mode: 'standalone',
  }),
});