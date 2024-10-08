<script setup>
import AddressBar from './components/AddressBar/index.vue'
import BrowserTabs from './components/BrowserTabs/index.vue'
</script>

<template>
  <div class="app">
    <div drag flex flex-row class="title-bar">
      <div flex-1>
        <browser-tabs wh-full />
      </div>
      <window-handle min-w-240 />
    </div>
    <address-bar />
  </div>
</template>

<style scoped lang="scss">
.app {
  .title-bar {
    height: var(--title-bar-height);
    background: var(--title-bar-background);
  }
}
</style>
