import { defineConfig, presetAttributify, presetMini } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    // 基础预设，提供类似 Tailwind CSS 的功能
    presetMini(),
    presetAttributify(),
    presetRemToPx({ baseFontSize: 4 })
  ],
  rules: [
    // 自定义规则
  ],
  shortcuts: [
    // 快捷方式
    ['wh-full', 'w-full h-full'],
    ['flex-center', 'flex justify-center items-center'],
    {
      drag: {
        '-webkit-app-region': 'drag'
      },
      'no-drag': {
        '-webkit-app-region': 'no-drag'
      }
    },
    {
      btn: 'px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700'
    }
  ]
})
