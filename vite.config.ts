import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), engineioBrowserTransports()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'socket.io-client': fileURLToPath(
        new URL('./node_modules/socket.io-client/build/esm/index.js', import.meta.url),
      ),
      'engine.io-client': fileURLToPath(
        new URL('./node_modules/engine.io-client/build/esm/index.js', import.meta.url),
      ),
    },
  },
  server: {
    open: true,
    proxy: {
      '/api': { target: 'http://localhost:5001', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:5001', ws: true },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    maxWorkers: 4,
    server: {
      deps: {
        inline: [/socket.io-client/, /engine.io-client/, /socket.io-parser/, /engine.io-parser/],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
    },
  },
})

function engineioBrowserTransports(): Plugin {
  return {
    name: 'engineio-browser-transports',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer || !importer.includes('engine.io-client/build/esm')) return null
      if (!/\.node\.js$/.test(source)) return null
      if (source.includes('globals.node.js')) return null
      return path.join(path.dirname(importer), source.replace(/\.node\.js$/, '.js'))
    },
  }
}
