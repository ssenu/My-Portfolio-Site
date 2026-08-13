import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ssenu.dev',
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
});
