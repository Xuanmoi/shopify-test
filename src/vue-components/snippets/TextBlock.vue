<template>
  <div class="text-block-container">
    <component
      :is="element"
      :class="classes"
      :style="styles"
      v-bind="shopifyAttributes"
    >
      <slot>
        <rte-formatter v-if="isRte">
          <div v-html="text"></div>
        </rte-formatter>
        <div v-else>{{ text }}</div>
      </slot>
    </component>
    xx {{ text }}
    <div v-show="false"> test my new text content</div>
    <div>
      <img src="https://cdn.pixabay.com/photo/2021/08/03/14/07/river-6519572_1280.jpg" alt="test image" width="100" height="100" aria-hidden="true"/>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'

const props = defineProps({
  blockId: String,
  sectionId: String,
})

const blockSettings = ref({})
const shopifyAttributes = ref({})

onMounted(async () => {
  // 获取当前自定义元素的 DOM 节点
  const instance = getCurrentInstance()
  const element = instance?.vnode?.el
  
  // 找到包含 data-vue-component 的父容器
  let container = element?.parentElement
  while (container && container.dataset.vueComponent !== 'text-block') {
    container = container.parentElement
  }
  
  // 如果通过 blockId 查找
  if (!container && props.blockId) {
    container = document.querySelector(`[data-block-id="${props.blockId}"]`)
  }
  
  if (!container) {
    console.warn('TextBlock: Container not found')
    return
  }
  
  // 从容器读取 block settings
  const settingsData = container.dataset.blockSettings
  if (settingsData) {
    try {
      blockSettings.value = JSON.parse(settingsData)
    } catch (e) {
      console.error('Failed to parse blockSettings:', e)
    }
  }
  
  // 获取 Shopify 编辑器属性
  shopifyAttributes.value = {
    'data-shopify-editor-section-id': container.dataset.shopifyEditorSectionId || '',
    'data-shopify-editor-block-id': container.dataset.shopifyEditorBlockId || '',
  }

  // 获取商品详情的接口
  const pathname = window.location.pathname
  const productId = pathname.split('/').pop()
  console.log(productId)
  const response = await fetch(window.Shopify.routes.root + `products/${productId}.js`)
  const data = await response.json()
  console.log(data)
})

// 计算属性
const text = computed(() => blockSettings.value.text || '')
const isRte = computed(() => 
  blockSettings.value.type_preset === 'rte' || 
  blockSettings.value.type_preset === 'paragraph'
)

const element = computed(() => isRte.value ? 'rte-formatter' : 'div')

const classes = computed(() => {
  const base = 'spacing-style text-block'
  const width = blockSettings.value.width || '100%'
  const alignment = blockSettings.value.alignment || 'left'
  
  return [
    base,
    `text-block--${props.blockId}`,
    blockSettings.value.type_preset,
    width === '100%' ? `text-block--align-${alignment}` : '',
    blockSettings.value.background ? 'text-block--background' : '',
    isRte.value ? 'rte' : '',
  ].filter(Boolean).join(' ')
})

const styles = computed(() => {
  const width = blockSettings.value.width || '100%'
  const styles = {
    '--width': width,
  }
  
  if (width === '100%') {
    styles['--text-align'] = blockSettings.value.alignment || 'left'
  }
  
  if (blockSettings.value.background) {
    styles['--text-background-color'] = blockSettings.value.background_color || 'rgb(255 255 255 / 1.0)'
    styles['--text-corner-radius'] = `${blockSettings.value.corner_radius || 0}px`
  }
  
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')
})
</script>

<style scoped>
.text-block {
  /* 样式定义 */
}
</style>