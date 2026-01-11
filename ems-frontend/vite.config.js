import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: './',
  server: {
    port: 5173,
    host: 'localhost',
    open: true,
    proxy: {
      // Proxy API calls to backend
      '/api': {
        target: 'http://localhost:4999',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        dashboard: './pages/dashboard/dashboard.html',
        activities: './pages/activities/activities.html',
        report: './pages/report_page/report.html',
        support: './pages/support_page/support.html'
      },
      external: ['swiper']
    }
  },
  publicDir: 'images',
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/types': resolve(__dirname, './types'),
      '@/js': resolve(__dirname, './js'),
      '@/pages': resolve(__dirname, './pages')
    }
  },
  esbuild: {
    // Support for top-level await
    target: 'es2022'
  }
})