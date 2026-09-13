// @ts-check
import { defineConfig } from 'astro/config';

// Custom domain sits at the apex, so no `base` path is needed for GitHub Pages.
export default defineConfig({
  site: 'https://alexanderdietz.eu',
  build: {
    inlineStylesheets: 'always',
  },
});
