import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'

// 自动扫描 entries 目录生成多入口配置
function getEntries() {
  const entriesDir = resolve(__dirname, 'src/entries')
  const entries = {}
  
  function scanDir(dir, basePath = '') {
    const files = readdirSync(dir)
    files.forEach(file => {
      const fullPath = resolve(dir, file)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        scanDir(fullPath, `${basePath}${file}/`)
      } else if (file.endsWith('.js')) {
        const name = file.replace('.js', '')
        entries[`vue/${basePath}${name}`] = fullPath
      }
    })
  }
  
  scanDir(entriesDir)
  return entries
}

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 识别 Shopify 自定义元素
          isCustomElement: (tag) => 
            tag.startsWith('shop-') || 
            tag.includes('-component') ||
            tag.includes('-block')
        }
      }
    })
  ],
  build: {
    outDir: 'assets',
    emptyOutDir: false, // 不清空 assets，保留其他文件
    rollupOptions: {
      input: getEntries(),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'vue/chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'vue/[name]'
          }
          return 'vue/[name]'
        },
        format: 'es',
        // 确保代码可以在浏览器中直接运行
        inlineDynamicImports: false
      }
    },
    // 代码分割配置
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false // 开发时保留 console
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@theme': resolve(__dirname, 'assets')
    }
  }
})