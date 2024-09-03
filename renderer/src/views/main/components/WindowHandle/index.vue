<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useWindowStore } from '@/views/main/store'

const store = useWindowStore()

const { maximized } = storeToRefs(store)

const close = () => {
  store.close()
}

const restore = () => {
  maximized.value = false
  store.restore()
}

const minimize = () => {
  store.minimize()
}

const maximize = () => {
  maximized.value = true
  store.maximize()
}

onMounted(() => {
  store.init()
  console.log('store window init')
})
</script>

<template>
  <div flex flex-row justify-end no-drag class="window-handle">
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

<style lang="scss">
.window-handle {
  .item {
    width: 48px;
    height: 100%;

    &:hover {
      background: var(--window-handle-icon-hover);
    }

    svg {
      width: 16px;
      height: 16px;
      color: var(--window-handle-icon-color);
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
