import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Improve code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'gsap': ['gsap'],
          'react-router': ['react-router-dom'],
          'vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  // Enable gzip compression and proxy API requests to backend
  server: {
    compress: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/verify': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
