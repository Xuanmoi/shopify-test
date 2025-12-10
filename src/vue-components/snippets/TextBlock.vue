<script setup>
  import { computed, watchEffect, ref, useAttrs, onMounted } from 'vue'
  
  const props = defineProps({
    blockId: String,
    sectionId: String,
    blockSettings: {
      type: [String, Object],
      default: () => ({}),
    },
    dataBlockSettings: {
      type: String,
      default: '',
    },
  })
  
  const attrs = useAttrs() // 拿到 data-shopify-editor-* 等
  const settings = ref({})
  
  watchEffect(() => {
    const raw = props.blockSettings;
    if (typeof raw === 'string') {
      try {
        settings.value = JSON.parse(raw)
      } catch (e) {
        console.warn('blockSettings 解析失败', e)
        settings.value = {}
      }
    } else {
      settings.value = raw || {}
    }
  })
  
  const text = computed(() => settings.value.text || '')
  onMounted(() => {
    console.log('attrs', attrs)
    // 参考资料：https://shopify.dev/docs/api/ajax
    // 如果我希望在组件里获取商品的信息，我可以通过接口，例如 
    fetch(`${window.location.pathname}.js`)
    .then(response => response.json())
    .then(product => {
      console.log('product', product)
    })
  })
  </script>
  
  <template>
    <div>
      <!-- v-bind='attrs' 透传 data-shopify-editor-* 等属性  -->
      <div v-html="text" v-bind="attrs"></div>
    </div>
  </template>