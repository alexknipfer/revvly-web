import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [tsConfigPaths(), tanstackStart(), nitro(), viteReact()],
  // Keep sharp out of the SSR bundle so Node loads it at runtime (avoids "require is not defined")
  ssr: {
    external: ['sharp'],
  },
  nitro: {
    hooks: {
      // Nitro builds the server with Rollup; add sharp to externals so it isn't bundled
      'rollup:before'(
        _nitro: unknown,
        config: { external?: string[] | ((id: string) => boolean) },
      ) {
        if (config?.external && Array.isArray(config.external)) {
          config.external = [...config.external, 'sharp'];
        }
      },
    },
  },
  // To fix the error "The requested module does not provide an export named 'parse'"
  optimizeDeps: {
    include: ['@clerk/tanstack-react-start', 'cookie-es'],
    exclude: ['sharp'],
  },
});
