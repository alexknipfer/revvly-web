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
  // To fix the error "The requested module does not provide an export named 'parse'"
  optimizeDeps: {
    include: ['@clerk/tanstack-react-start', 'cookie-es'],
  },
});
