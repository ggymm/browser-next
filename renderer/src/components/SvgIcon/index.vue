<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: '16px'
  },
  icon: {
    type: String,
    required: true
  }
})

const symbolId = computed(() => `#icon-${props.icon}`)
</script>

<template>
  <svg aria-hidden="true" :width="size" :height="size">
    <use :xlink:href="symbolId" fill="currentColor" />
  </svg>
</template>
