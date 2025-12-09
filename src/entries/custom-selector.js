import { defineCustomElement } from 'vue'
import CustomSelector from '../vue-components/snippets/CustomSelector.vue'

// 将 Vue 组件编译为 Web Component
const CustomSelectorElement = defineCustomElement(CustomSelector)

// 注册自定义元素
if (!customElements.get('custom-selector-vue')) {
  customElements.define('custom-selector-vue', CustomSelectorElement)
}
