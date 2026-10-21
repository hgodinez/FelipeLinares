// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL: public origin (e.g. https://felipelinares.art). BASE_PATH: sub-path when hosted
// under a project path such as https://user.github.io/FelipeLinares (set to "/FelipeLinares").
const site = process.env.SITE_URL || 'https://felipelinaresvargas.example';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-MX', en: 'en' } },
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  image: { responsiveStyles: true },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
