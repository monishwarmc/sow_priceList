import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to network
    port: 5173,
    allowedHosts : ['all', '922e5bfe-cd6b-4786-bc47-a95a7ffb9e47-00-3gjtot5kh15yu.worf.replit.dev'],
  },
});