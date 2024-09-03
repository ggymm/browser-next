<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import Draggable from 'draggabilly'

import { useTabsStore } from '@/views/main/store'
import SvgIcon from '@/components/SvgIcon/index.vue'

const store = useTabsStore()
const { tabs, current, minWidth, maxWidth } = storeToRefs(store)

const width = ref(maxWidth)

const tabsRef = ref()

const isLast = (i) => {
  return i === tabs.value.length - 1
}

const setTabRef = (e, tab) => {
  if (e) {
    tab['$el'] = e
  }
}

const init = () => {
  for (const tab of tabs.value) {
    if (tab['$el']) {
      const inst = new Draggable(tab['$el'], {
        axis: 'x',
        containment: true
      })
      inst.on('dragEnd', () => {
        console.log('drag end')
      })
      inst.on('dragMove', () => {
        console.log('drag move')
      })
      tab['inst'] = inst
    }
  }
}

onMounted(() => {
  store.init()
  console.log('store tabs init')
  nextTick(() => {
    init()
  })
})
</script>

<template>
  <div class="browser-tabs">
    <div flex-center class="shortcut">
      <div w-28 h-28 border-rd-10 flex-center class="content">
        <svg-icon w-16 h-16 icon="arrow-down" />
      </div>
    </div>
    <div ref="tabsRef" pt-4 flex flex-row class="container">
      <div
        flex
        flex-row
        relative
        class="tab-item"
        :key="tab['id']"
        :ref="(e) => setTabRef(e, tab)"
        :style="{ width: width + 'px' }"
        :class="{ active: current === tab['id'] }"
        v-for="(tab, i) in tabs"
      >
        <div z-8 top-0 left-0 wh-full absolute flex-center class="tab-bg">
          <div mb-5 class="tab-hover"></div>
          <div mb-5 class="tab-divider"></div>
          <div mb-5 class="tab-divider-last" v-if="isLast(i)"></div>
        </div>
        <div z-9 pb-5 wh-full select-none flex items-center class="tab-main">
          <div w-16 h-16 mx-12 flex-center>
            <svg-icon icon="loading" v-if="tab['loading']" />
            <img wh-full :src="tab['favicon']" alt="" v-else />
          </div>
          <div flex-1 font-size-12 overflow-hidden whitespace-nowrap class="tab-title">
            {{ tab['title'] }}
          </div>
          <div w-16 h-16 mx-12 border-rd-full flex-center class="tab-close">
            <svg-icon w-12 h-12 icon="tab-close" />
          </div>
        </div>
      </div>
      <div pb-5 w-36 flex-center class="tab-add">
        <div w-24 h-24 border-rd-full flex-center class="content">
          <svg-icon w-14 h-14 icon="tab-add" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 参考：https://juejin.cn/post/6986827061461516324
$size: 12;

.browser-tabs {
  display: flex;
  flex-direction: row;

  .shortcut {
    width: var(--title-height);
    height: var(--title-height);

    .content {
      background: var(--browser-tabs-btn-background);

      &:hover {
        background: var(--browser-tabs-btn-background-hover);
      }

      &:active {
        background: var(--browser-tabs-btn-background-active);
      }
    }
  }

  .container {
    .tab-add {
      height: 100%;

      .content {
        &:hover {
          background: var(--browser-tabs-btn-background-hover);
        }

        &:active {
          background: var(--browser-tabs-btn-background-active);
        }
      }
    }

    .tab-item {
      &:hover {
        & + .tab-item .tab-bg .tab-divider {
          display: none;
        }

        .tab-bg {
          .tab-hover {
            display: block;
          }

          .tab-divider,
          .tab-divider-last {
            display: none;
          }
        }
      }

      &:first-child .tab-bg .tab-divider {
        display: none;
      }

      &.is-dragging {
        z-index: 10 !important;

        .tab-bg {
          .tab-divider,
          .tab-divider-last {
            display: none;
          }
        }
      }

      &.active {
        border-radius: #{$size}px #{$size}px 0 0;
        background: var(--browser-tabs-background-active);

        & + .tab-item .tab-bg .tab-divider {
          display: none;
        }

        .tab-bg {
          &::before,
          &::after {
            position: absolute;
            width: #{$size * 2}px;
            height: #{$size * 2}px;
            bottom: 0;
            content: '';
            box-shadow: 0 0 0 #{$size * 2}px var(--browser-tabs-background-active);
            border-radius: 100%;
          }

          &::before {
            left: -#{$size * 2}px;
            clip-path: inset(50% -#{$size}px 0 50%);
          }

          &::after {
            right: -#{$size * 2}px;
            clip-path: inset(50% 50% 0 -#{$size}px);
          }

          .tab-hover {
            display: none;
          }

          .tab-divider,
          .tab-divider-last {
            display: none;
          }
        }
      }

      .tab-bg {
        .tab-hover {
          width: calc(100% - 12px);
          height: calc(100% - 8px);
          display: none;
          background: var(--browser-tabs-background-hover);
          border-radius: 10px;
        }

        .tab-divider {
          position: absolute;
          left: 0;
          width: 2px;
          height: 50%;
          background: var(--browser-tabs-divider-background);
        }

        .tab-divider-last {
          position: absolute;
          right: 0;
          width: 2px;
          height: 50%;
          background: var(--browser-tabs-divider-background);
        }
      }

      .tab-main {
        .tab-title {
          //noinspection CssInvalidPropertyValue
          -webkit-mask: linear-gradient(270deg, transparent 0px, gray 28px);
        }

        .tab-close:hover {
          background: var(--common-hover);
        }
      }
    }
  }
}
</style>
