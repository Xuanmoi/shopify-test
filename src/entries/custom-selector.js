import { createApp } from 'vue'
import CustomSelector from '@/vue-components/snippets/CustomSelector.vue'

function mountAll(rootSelector = '.custom-selector') {
  document.querySelectorAll(rootSelector).forEach((root) => {
    if (root.__vue_app__) return
    const app = createApp(CustomSelector, { root })
    app.mount(root)
    root.__vue_app__ = app
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => mountAll())
} else {
  mountAll()
}

// Shopify 主题编辑器中 section reload 也要重新挂载
document.addEventListener('shopify:section:load', () => mountAll())
document.addEventListener('shopify:section:unload', (event) => {
  event.target
    ?.querySelectorAll('.custom-selector')
    .forEach((root) => {
      if (root.__vue_app__) {
        root.__vue_app__.unmount()
        delete root.__vue_app__
      }
    })
})