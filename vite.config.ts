import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || ''),
        'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || '')
      },
      build: {
        target: 'es2022',
        minify: 'esbuild', // Highly compressed, fast, comments-purged minification using esbuild
        sourcemap: false,  // Eliminate bulky map directories in final build
        cssMinify: true,   // High-grade modular CSS layout compression
        cssCodeSplit: true, // Split CSS modules into their respective dynamic import targets
        assetsInlineLimit: 4096, // Inline media under 4KB (logos, vectors) to keep HTTP round-trips to minimum
        rollupOptions: {
          output: {
            // Intelligent manual chunking to maximize parallel multi-threaded CDN caching of frameworks
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                if (id.includes('framer-motion') || id.includes('motion')) {
                  return 'vendor-motion';
                }
                return 'vendor-libs';
              }
            }
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
