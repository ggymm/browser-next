<script setup>
import SvgIcon from '@/components/SvgIcon/index.vue'

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useWindowStore } from '@/views/main/store/modules/window'

const store = useWindowStore()

const { maximized } = storeToRefs(store)

const close = () => {
  store.close()
}

const restore = () => {
  // maximized.value = false
  store.restore()
}

const minimize = () => {
  store.minimize()
}

const maximize = () => {
  // maximized.value = true
  store.maximize()
}

onMounted(() => {
  store.init()
  console.log(maximized.value)
})
</script>

<template>
  <div flex flex-row justify-end no-drag class="handle">
    <div flex-center class="handle-item" @click="minimize()">
      <SvgIcon icon="minimize" />
    </div>
    <div flex-center class="handle-item" v-if="maximized" @click="restore()">
      <SvgIcon icon="restore" />
    </div>
    <div flex-center class="handle-item" v-if="!maximized" @click="maximize()">
      <SvgIcon icon="maximize" />
    </div>
    <div flex-center class="handle-item close" @click="close()">
      <SvgIcon icon="close" />
    </div>
  </div>
</template>

<style lang="scss">
.handle-item {
  width: 48px;
  height: 100%;

  &:hover {
    background: var(--title-icon-hover);
  }

  svg {
    width: 16px;
    height: 16px;
    color: var(--title-icon-color);
  }

  &.close {
    &:hover {
      background: red;

      svg {
        color: var(--title-icon-close-hover);
      }
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
