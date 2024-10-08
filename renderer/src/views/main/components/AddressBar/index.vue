<script setup>
import { storeToRefs } from 'pinia'

import { useViewStore } from '@/views/main/store'

const store = useViewStore()
const { url, canBack, canForward, canReload } = storeToRefs(store)
</script>

<template>
  <div class="address-bar">
    <div class="nav">
      <svg-icon-wrap icon="nav-back" :class="{ disable: !canBack }" />
      <svg-icon-wrap icon="nav-forward" :class="{ disable: !canForward }" />
      <svg-icon-wrap icon="nav-refresh" v-if="canReload" :class="{ disable: !canReload }" />
      <svg-icon-wrap icon="nav-stop" v-if="!canReload" :class="{ disable: canReload }" />
    </div>
    <div class="url">
      <div class="input">
        <div class="prefix"></div>
        <input type="text" :value="url" />
        <div class="suffix"></div>
      </div>
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

  .nav {
    padding: 0 8px;

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
        width: 16px;
        height: 16px;
      }
    }
  }

  .url {
    flex: 1;
    display: flex;
    flex-direction: row;

    .input {
      flex: 1;
      height: var(--address-bar-url-height);
      border-radius: var(--address-bar-url-height);
      background: var(--address-bar-url-background);

      display: flex;
      flex-direction: row;

      input {
        width: 100%;
        height: 100%;
        background: var(--address-bar-url-background);
      }

      .prefix {
        width: 20px;
      }

      .suffix {
        width: 20px;
      }
    }
  }

  .tools {
    width: 200px;
  }
}
</style>
