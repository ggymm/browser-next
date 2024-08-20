<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: 'icon'
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.icon}`)
</script>

<template>
  <svg aria-hidden="true" width="16px" height="16px">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>
