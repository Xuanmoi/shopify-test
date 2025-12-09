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
    console.log('raw', raw)
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
    console.log('settings', settings.value)
  })
  
  const text = computed(() => settings.value.text || '')
  onMounted(() => {
    console.log('attrs', attrs)
  })
  </script>
  
  <template>
    <div>
      <!-- v-bind='attrs' 透传 data-shopify-editor-* 等属性  -->
      <div v-html="text" v-bind="attrs"></div>
    </div>
  </template>