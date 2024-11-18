<script setup>
import { onMounted } from 'vue'
import { useWindow } from './index.js'

const window = useWindow()

const { maximized } = window

const close = () => {
  window.closeWindow()
}

const restore = () => {
  maximized.value = false
  window.restoreWindow()
}

const minimize = () => {
  window.minimizeWindow()
}

const maximize = () => {
  maximized.value = true
  window.maximizeWindow()
}

onMounted(() => {
  console.log('store window init')
})
</script>

<template>
  <div flex flex-row justify-end no-drag id="window-handle" class="window-handle">
    <div no-drag flex-center class="item" @click="minimize()">
      <svg-icon icon="minimize" />
    </div>
    <div no-drag flex-center class="item" v-if="maximized" @click="restore()">
      <svg-icon icon="restore" />
    </div>
    <div no-drag flex-center class="item" v-if="!maximized" @click="maximize()">
      <svg-icon icon="maximize" />
    </div>
    <div no-drag flex-center class="item close" @click="close()">
      <svg-icon icon="close" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.window-handle {
  .item {
    width: 48px;
    height: 100%;

    &:hover {
      background: var(--window-handle-icon-hover);
    }

    svg {
      color: var(--window-handle-icon-color);
      width: 16px;
      height: 16px;
    }

    &.close {
      &:hover {
        background: var(--window-handle-icon-close-background);

        svg {
          color: var(--window-handle-icon-close-hover);
        }
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
