<script setup>
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
    <div class="address-bar"></div>
  </div>
</template>

<style scoped lang="scss">
.app {
  .title-bar {
    height: var(--title-height);
    background: var(--title-background);
  }

  .address-bar {
  }
}
</style>
