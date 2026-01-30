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
  // Externalize sharp so it's not bundled (uses CommonJS require() internally)
  ssr: {
    external: ['sharp'],
  },
  // To fix the error "The requested module does not provide an export named 'parse'"
  optimizeDeps: {
    include: ['@clerk/tanstack-react-start', 'cookie-es'],
    exclude: ['sharp'],
  },
});
