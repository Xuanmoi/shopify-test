/**
 * Shopify 数据桥接工具
 * 用于在 Vue 组件中获取 Liquid 传递的数据
 */

/**
 * 从 data 属性或 JSON script 标签获取数据
 * @param {HTMLElement} element - 容器元素
 * @param {string} key - 数据键名
 * @returns {any} 解析后的数据
 */
export function getShopifyData(element, key) {
  // 方法1: 从 data 属性获取
  const dataAttr = element.dataset[key]
  if (dataAttr) {
    try {
      return JSON.parse(dataAttr)
    } catch {
      return dataAttr
    }
  }

  // 方法2: 从 JSON script 标签获取
  const scriptTag = element.querySelector(`script[type="application/json"][data-key="${key}"]`)
  if (scriptTag) {
    try {
      return JSON.parse(scriptTag.textContent)
    } catch (e) {
      console.error(`Failed to parse data for key: ${key}`, e)
      return null
    }
  }

  return null
}

/**
 * 获取 Shopify block attributes
 * @param {HTMLElement} element - 容器元素
 * @returns {object} Shopify 属性对象
 */
export function getShopifyAttributes(element) {
  return {
    'data-shopify-editor-section-id': element.dataset.shopifyEditorSectionId,
    'data-shopify-editor-block-id': element.dataset.shopifyEditorBlockId,
    // 添加其他需要的属性
  }
}

/**
 * 监听 Shopify 主题编辑器事件
 * @param {Function} callback - 回调函数
 */
export function onShopifySectionLoad(callback) {
  document.addEventListener('shopify:section:load', (event) => {
    callback(event.detail?.sectionId)
  })
}

export function onShopifySectionUnload(callback) {
  document.addEventListener('shopify:section:unload', (event) => {
    callback(event.detail?.sectionId)
  })
}