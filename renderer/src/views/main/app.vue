<script setup>
import BrowserTabs from './components/BrowserTabs/index.vue'
import WindowHandle from './components/WindowHandle/index.vue'
</script>

<template>
  <div class="app">
    <div drag class="title">
      <BrowserTabs flex-1 />
      <WindowHandle min-w-240 />
    </div>
    <div class="address"></div>
  </div>
</template>

<style lang="scss" scoped>
.app {
  .title {
    display: flex;
    flex-direction: row;

    height: var(--title-height);
    background: var(--title-background);
  }

  .address {
  }
}
</style>
