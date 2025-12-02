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
  root: HTMLElement,
})

const handleChange = () => {
  console.log('selected', selected.value)
}

onMounted(() => {
  const root = props.root;
  label.value = root.dataset.label
  selectorData.value = JSON.parse(root.dataset.selector || '[]')
})
</script>