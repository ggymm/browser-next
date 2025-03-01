<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import { useTabsStore } from '@/views/main/store'

import { on, off } from '@/utils/dom'
import { useWindowSizeFn } from '@/hooks/event'

const minWidth = 120
const maxWidth = 240

const store = useTabsStore()
const { tabs, width, current } = storeToRefs(store)

const tabsRef = ref()

const isLast = (i) => {
  return i === tabs.value.length - 1
}

const setTabRef = (e, tab) => {
  if (e) {
    tab['el'] = e
  }
}

const init = () => {
  for (let i = 0; i < tabs.value.length; i++) {
    const x = width.value * i
    tabs.value[i]['x'] = x
    tabs.value[i]['el'].style.left = `${x}px`
  }
}

const reinit = () => {
  // 重新计算宽度
  const w = tabsRef.value.clientWidth - 80
  const len = tabs.value.length
  width.value = Math.min(Math.max(w / len, minWidth), maxWidth)

  for (let i = 0; i < tabs.value.length; i++) {
    const x = width.value * i
    tabs.value[i]['x'] = x
    tabs.value[i]['el'].style.left = `${x}px`
  }
}

const handleChoose = (ev, tab) => {
  current.value = tab['id']

  // 添加拖拽样式
  nextTick(() => {
    el.classList.add('dragging')
  })

  const x = tab['x']
  const el = tab['el']

  const left = ev.clientX - x
  const right = (tabs.value.length - 1) * width.value + left
  // const right = tabs.value.length * width.value - (width.value - ev.clientX + x)

  const tabsVal = tabs.value
  const widthVal = width.value
  const widthHalf = width.value / 2

  const up = () => {
    el.style.left = `${tab['x']}px`
    el.style.transform = 'translateX(0px)'

    // 移除拖拽样式
    nextTick(() => {
      el.classList.remove('dragging')
    })

    // 移除鼠标事件监听
    off(document, 'mouseup', up)
    off(document, 'mousemove', move)
  }

  const move = (e) => {
    if (e.clientX < left || e.clientX > right) {
      return
    }

    const dis = e.clientX - ev.clientX
    el.style.transform = `translateX(${dis}px)`

    const currX = x + dis + widthHalf
    for (let i = 0; i < tabsVal.length; i++) {
      const target = tabsVal[i]
      if (tab['id'] === target['id']) {
        continue
      }

      const targetX = target['x']
      if (currX > targetX && currX < targetX + widthVal) {
        swap(tab, target)
      }
    }
  }

  const swap = (curr, target) => {
    let i = -1
    let j = -1
    for (let n = 0; n < tabsVal.length; n++) {
      if (curr['id'] === tabsVal[n]['id']) {
        i = n
      }
      if (target['id'] === tabsVal[n]['id']) {
        j = n
      }
    }

    // 交换索引值
    ;[tabsVal[i], tabsVal[j]] = [tabsVal[j], tabsVal[i]]

    // 交换坐标值
    const tmp = curr['x']
    curr['x'] = target['x']
    target['x'] = tmp

    // 添加过渡动画
    setTimeout(() => {
      target['el'].style.left = `${tmp}px`
      target['el'].classList.add('moving')
    }, 50)
    setTimeout(() => {
      target['el'].classList.remove('moving')
    }, 200)
  }

  // 添加鼠标事件监听
  on(document, 'mouseup', up)
  on(document, 'mousemove', move)
}

useWindowSizeFn(() => {
  reinit()
})

onMounted(() => {
  nextTick(() => {
    init()
  })
})
</script>

<template>
  <div class="browser-tabs">
    <div class="tabs-shortcut">
      <svg-icon-wrap size="16px" icon="down" />
    </div>
    <div ref="tabsRef" class="tabs-container">
      <div
        class="tab-item no-drag"
        :key="tab['id']"
        :ref="(e) => setTabRef(e, tab)"
        :style="{ width: `${width}px` }"
        :class="{ active: current === tab['id'] }"
        v-for="(tab, i) in tabs"
        @mousedown="handleChoose($event, tab)"
      >
        <div class="tab-bg">
          <div class="tab-hover"></div>
          <div class="tab-divider"></div>
          <div class="tab-divider-last" v-if="isLast(i)"></div>
        </div>
        <div class="tab-main">
          <div class="tab-icon">
            <svg-icon icon="loading" v-if="tab['loading']" />
            <img wh-full :src="tab['favicon']" alt="" v-else />
          </div>
          <div class="tab-title">{{ tab['title'] }}</div>
          <div class="tab-close">
            <svg-icon size="12px" icon="tab-close" />
          </div>
        </div>
      </div>
      <div class="tab-create" :style="{ left: `${width * tabs.length + 4}px` }">
        <svg-icon-wrap size="14px" icon="tab-add" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$size: 12;

.browser-tabs {
  display: flex;
  flex-direction: row;

  .tabs-shortcut {
    width: var(--title-bar-height);
    height: var(--title-bar-height);

    display: flex;
    align-items: center;
    justify-content: center;

    .wrap {
      width: 28px;
      height: 28px;
      border-radius: 10px;
      background: var(--title-bar-tabs-btn-background);

      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: var(--title-bar-tabs-btn-background-hover);
      }

      &:active {
        background: var(--title-bar-tabs-btn-background-active);
      }
    }
  }

  .tabs-container {
    position: relative;
    flex: 1;
    display: flex;
    margin-top: 4px;

    .tab-item {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;

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

      &:first-child {
        .tab-bg .tab-divider {
          display: none;
        }
      }

      &.active {
        border-radius: #{$size}px #{$size}px 0 0;
        background: var(--title-bar-tabs-background-active);

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
            box-shadow: 0 0 0 #{$size * 2}px var(--title-bar-tabs-background-active);
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

      &.moving {
        transition: 150ms;
      }

      &.dragging {
        z-index: 10 !important;

        .tab-bg {
          .tab-divider,
          .tab-divider-last {
            display: none;
          }
        }
      }

      .tab-bg {
        z-index: 8;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        .tab-hover {
          width: calc(100% - 12px);
          height: calc(100% - 8px);
          display: none;
          background: var(--title-bar-tabs-background-hover);
          margin-bottom: 5px;
          border-radius: 10px;
        }

        .tab-divider {
          position: absolute;
          left: 0;
          width: 2px;
          height: 50%;
          background: var(--title-bar-tabs-divider-background);
          margin-bottom: 5px;
        }

        .tab-divider-last {
          position: absolute;
          right: 0;
          width: 2px;
          height: 50%;
          background: var(--title-bar-tabs-divider-background);
          margin-bottom: 5px;
        }
      }

      .tab-main {
        z-index: 9;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        user-select: none;
        padding-bottom: 5px;

        display: flex;
        align-items: center;
        justify-content: center;

        .tab-icon {
          width: 16px;
          height: 16px;
          margin: 0 12px;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tab-title {
          flex: 1;
          font-size: 12px;
          color: var(--title-bar-tabs-title-color);
          overflow: hidden;
          white-space: nowrap;
          //noinspection CssInvalidPropertyValue
          -webkit-mask: linear-gradient(270deg, transparent 0px, gray 28px);
        }

        .tab-close {
          width: 18px;
          height: 18px;
          margin: 0 12px;
          border-radius: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background: var(--common-hover);
          }
        }
      }
    }

    .tab-create {
      position: absolute;
      top: 0;
      left: 0;
      width: 36px;
      height: 100%;
      padding-bottom: 5px;

      display: flex;
      align-items: center;
      justify-content: center;

      .wrap {
        width: 28px;
        height: 28px;
        border-radius: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background: var(--title-bar-tabs-btn-background-hover);
        }

        &:active {
          background: var(--title-bar-tabs-btn-background-active);
        }
      }
    }
  }
}
</style>
