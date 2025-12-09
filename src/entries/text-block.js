import { defineCustomElement } from 'vue'
import TextBlock from '../vue-components/snippets/TextBlock.vue'

// 将 Vue 组件编译为 Web Component
const TextBlockElement = defineCustomElement(TextBlock)

// 注册自定义元素
if (!customElements.get('text-block-vue')) {
  customElements.define('text-block-vue', TextBlockElement)
}
