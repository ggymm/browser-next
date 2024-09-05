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
  },
  wrap: {
    type: String,
    default: 'wrap'
  }
})

const symbolId = computed(() => `#icon-${props.icon}`)
</script>

<template>
  <div :class="wrap">
    <svg aria-hidden="true" :width="size" :height="size">
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </div>
</template>
