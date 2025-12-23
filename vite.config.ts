import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tsConfigPaths(),
    tanstackStart(),
    viteReact(),
  ],
  // To fix the error "The requested module does not provide an export named 'parse'"
  optimizeDeps: {
    include: ['@clerk/tanstack-react-start', 'cookie-es'],
  },
  resolve: {
    // Aliases are added as a workaround: https://github.com/clerk/javascript/issues/6996
    alias: [
      {
        find: 'cookie',
        replacement: 'cookie-es',
      },
    ],
  },
});
