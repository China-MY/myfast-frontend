import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: '$injectedColor: orange;',
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            ///console.log('代理错误', err);
            if (res.writeHead && !res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ message: '代理服务器错误' }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            ///console.log('代理发送请求到:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            ///console.log('代理收到响应:', proxyRes.statusCode);
            proxyRes.headers['access-control-allow-origin'] = '*';
          });
        }
      },
      '/docs': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            ///console.log('Swagger代理错误', err);
            if (res.writeHead && !res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
              });
              res.end('<h1>Swagger文档加载失败</h1><p>请确保后端服务正常运行</p>');
            }
          });
        }
      },
      '/openapi.json': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      },
      '/redoc': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      external: []
    }
  }

})
