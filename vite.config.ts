import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'

import { cssPreloader } from './vite-css-preloader'
import { prerender } from './vite-plugin-prerender'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Pages({ importMode: 'async' }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,

      manifest: {
        name: 'PokeDex - Catch All Pokemons',
        short_name: 'PokeDex',
        description: 'Application to explore and catch all pokemons',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        lang: 'id',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith('/api/v2')
            },
            handler: 'CacheFirst' as const,
            options: {
              cacheName: 'poke-api-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365 * 2,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*/i,
            handler: 'CacheFirst' as const,
            options: {
              cacheName: 'poke-img-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365 * 2,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/dxa4bdtdx\/image\/upload.*/i,
            handler: 'CacheFirst' as const,
            options: {
              cacheName: 'fajar-img-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365 * 2,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,txt,woff,woff2,avif,webp,pdf}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
    prerender(),
    cssPreloader(),
  ],
  server: {
    port: 3000,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    modulePreload: {
      polyfill: false,
    },
    cssCodeSplit: true,
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
