<script setup>
import BrowserTab from './components/BrowserTab/index.vue'
import WindowHandle from './components/WindowHandle/index.vue'
</script>

<template>
  <div class="app">
    <div flex flex-row style="height: var(--title-height); background: var(--title-background)">
      <BrowserTab flex-1 />
      <WindowHandle min-w-240 />
    </div>
  </div>
</template>

<style lang="scss"></style>
