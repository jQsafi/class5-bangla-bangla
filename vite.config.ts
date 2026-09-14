import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/class5-bangla-bangla/',
  plugins: [react()],
  server: {
    port: 5174,
    host: true
  }
});
