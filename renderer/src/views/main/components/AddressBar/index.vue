<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useViewStore } from '@/views/main/store'

const store = useViewStore()
const { url, canBack, canForward, canReload } = storeToRefs(store)

const urls = computed(() => {
  try {
    const u = new URL(url.value)

    if (u.pathname === '/') {
      return [
        { val: u.protocol + '//', grey: true },
        { val: u.hostname, grey: false },
        { val: u.port ? ':' : '', grey: true },
        { val: u.port, grey: true },
        { val: u.search, grey: true },
        { val: u.hash, grey: true }
      ]
    }

    return [
      { val: u.protocol + '//', grey: true },
      { val: u.hostname, grey: false },
      { val: u.port ? ':' : '', grey: true },
      { val: u.port, grey: true },
      { val: u.pathname, grey: true },
      { val: u.search, grey: true },
      { val: u.hash, grey: true }
    ]
  } catch (e) {
    return [{ val: url.value, grey: false }]
  }
})

const active = ref(false)
const handleBlur = () => {
  active.value = false
}
const handleFocus = () => {
  active.value = true
}
</script>

<template>
  <div class="address-bar">
    <div class="address-bar__nav">
      <svg-icon-wrap icon="nav-back" :class="{ disable: !canBack }" />
      <svg-icon-wrap icon="nav-forward" :class="{ disable: !canForward }" />
      <svg-icon-wrap icon="nav-refresh" v-if="canReload" :class="{ disable: !canReload }" />
      <svg-icon-wrap icon="nav-stop" v-if="!canReload" :class="{ disable: canReload }" />
    </div>
    <div class="address-bar__url">
      <div class="address-bar__url-input" :class="{ active: active }">
        <div class="input-mask" :style="{ display: active ? 'none' : 'flex' }">
          <div v-for="(item, i) in urls" :key="i" :style="{ opacity: item['grey'] ? 0.7 : 1 }">
            {{ item['val'] }}
          </div>
        </div>
        <input
          class="input-value"
          type="text"
          v-model="url"
          @blur="handleBlur"
          @focus="handleFocus"
          :style="{ color: active ? '' : 'transparent' }"
        />
      </div>
      <div class="address-bar__url-prefix">
        <svg-icon-wrap icon="info" />
      </div>
      <div class="address-bar__url-suffix"></div>
    </div>
    <div class="tools"></div>
  </div>
</template>

<style scoped lang="scss">
.address-bar {
  height: var(--address-bar-height);
  padding: 6px 0;
  display: flex;
  flex-direction: row;

  &__nav {
    padding: 0 12px;

    display: flex;
    flex-direction: row;
    align-items: center;

    :deep(.wrap) {
      width: 32px;
      height: 32px;
      border-radius: 100%;
      background: var(--address-bar-background);

      display: flex;
      align-items: center;
      justify-content: center;

      &:not(.disable):hover {
        background: var(--common-hover);
      }

      &:not(.disable):active {
        background: var(--common-active);
      }

      &.disable {
        svg {
          color: var(--navigation-icon-disabled);
        }
      }

      svg {
        color: var(--navigation-icon-color);
        width: 18px;
        height: 18px;
      }
    }
  }

  &__url {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: row;

    &-prefix {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--address-bar-url-height);
      height: var(--address-bar-url-height);

      display: flex;
      align-items: center;
      justify-content: center;

      .wrap {
        width: 24px;
        height: 24px;
        border-radius: 24px;
        background: var(--address-bar-url-btn-background);

        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background: var(--address-bar-url-btn-background-hover);
        }

        &:active {
          background: var(--address-bar-url-btn-background-active);
        }
      }
    }

    &-suffix {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 100%;
    }

    &-input {
      position: relative;
      padding: 0 36px;
      border: var(--address-bar-url-border);
      height: var(--address-bar-url-height);
      border-radius: var(--address-bar-url-height);
      background: var(--address-bar-url-background);

      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;

      &:hover {
        border: var(--address-bar-url-border-hover);
        background: var(--address-bar-url-background-hover);
      }

      &.active {
        border: var(--address-bar-url-border-active);
        background: var(--address-bar-url-background-active);
      }

      .input-mask {
        position: absolute;
        height: var(--address-bar-url-input-height);
        line-height: var(--address-bar-url-input-height);
        font-size: 14px;
        font-family: 'Microsoft YaHei', 'sans-serif';
        user-select: none;
      }

      .input-value {
        width: 100%;
        height: var(--address-bar-url-input-height);
        line-height: var(--address-bar-url-input-height);
        background: transparent;
        font-size: 14px;
        font-family: 'Microsoft YaHei', 'sans-serif';
      }
    }
  }

  .tools {
    width: 200px;
  }
}
</style>
