// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://re-solve.at',
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      API_BASE_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'https://re-solve.at/api',
      }),
    },
  },
});
