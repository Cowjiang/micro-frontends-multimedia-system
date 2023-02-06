// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

// Utilities
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8887/service/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [
    vue({
      template: {transformAssetUrls}
    }),
    vuetify({
      autoImport: true
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      dts: 'src/auto-import.d.ts'
    }),
    Components({
      dts: 'src/components.d.ts'
    })
  ],
  define: {'process.env': {}},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue'
    ]
  },
  css: {
    preprocessorOptions: {
      // 全局样式引入
      scss: {
        additionalData: '@import "@/common/styles/index.scss";',
        javascriptEnabled: true
      }
    }
  }

});
