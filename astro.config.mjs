// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://antondvinyaninov.github.io',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  
  integrations: [
    react(),
    sitemap()
  ],

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'editor': ['@tiptap/react', '@tiptap/starter-kit'],
            'supabase': ['@supabase/supabase-js']
          }
        }
      }
    },
    ssr: {
      noExternal: ['@astrojs/react']
    },
    optimizeDeps: {
      exclude: ['@astrojs/react']
    }
  },
  
  image: {
    domains: ['antondvinyaninov.github.io'],
    remotePatterns: [{ protocol: 'https' }]
  },
  
  server: {
    port: 4321,
    // Увеличиваем лимит для загрузки файлов
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  
  compressHTML: true,
  
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro'
  },
  
  experimental: {
    clientPrerender: true
  }
});
