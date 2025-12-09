<template>
  <label>
    <span>{{ label }}</span>
    <select v-model="selected" @change="handleChange">
      <option v-for="option in selectorData" :value="option.value">{{ option.label }}</option>
    </select>
  </label>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selected = ref(null);

const label = ref(null);
const selectorData = ref(null);

const props = defineProps({
  dataSelector: {
    type: String,
    default: '[]',
  },
  dataLabel: {
    type: String,
    default: '',
  },
})

const handleChange = () => {
  console.log('selected', selected.value)
}

onMounted(() => {
  console.log("custom selector mounted")
  label.value = props.dataLabel;
  selectorData.value = JSON.parse(props.dataSelector || '[]');
  console.log('label', label.value)
  console.log('selectorData', selectorData.value)
})
</script>