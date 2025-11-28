import { defineCustomElement } from 'vue'
import TextBlock from '../vue-components/snippets/TextBlock.vue'

// 将 Vue 组件编译为 Web Component
const TextBlockElement = defineCustomElement(TextBlock)

// 自动挂载逻辑
function mountTextBlocks() {
  document.querySelectorAll('[data-vue-component="text-block"]').forEach((container) => {
    // 避免重复挂载
    if (container.__vueInstance) return
    
    // 创建自定义元素
    const element = document.createElement('text-block-vue')
    
    // 从容器读取数据并传递给自定义元素
    const blockSettings = container.dataset.blockSettings
    if (blockSettings) {
      try {
        const settings = JSON.parse(blockSettings)
        // 将数据作为属性传递
        element.setAttribute('block-id', container.dataset.blockId || '')
        element.setAttribute('section-id', container.dataset.sectionId || '')
        // 将 settings 存储在元素上，供 Vue 组件读取
        element._blockSettings = settings
      } catch (e) {
        console.error('Failed to parse blockSettings:', e)
      }
    }
    
    // 替换容器内容
    container.innerHTML = ''
    container.appendChild(element)
    
    container.__vueInstance = element
  })
}

// 注册自定义元素
if (!customElements.get('text-block-vue')) {
  customElements.define('text-block-vue', TextBlockElement)
}

// 初始挂载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountTextBlocks)
} else {
  mountTextBlocks()
}

// 监听 Shopify 主题编辑器事件
document.addEventListener('shopify:section:load', () => {
  mountTextBlocks()
})

document.addEventListener('shopify:section:unload', (event) => {
  event.target?.querySelectorAll('[data-vue-component="text-block"]').forEach((container) => {
    if (container.__vueInstance) {
      container.__vueInstance.remove()
      delete container.__vueInstance
    }
  })
})