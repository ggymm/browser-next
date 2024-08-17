import { defineConfig } from 'unocss'
import { presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    // 基础预设，提供类似 Tailwind CSS 的功能
    presetUno(),
    presetAttributify()
  ],

  // 自定义规则
  rules: [
    ['wh-full', 'w-full h-full'],
    ['flex-center', 'flex justify-center items-center']
  ],

  // 快捷方式
  shortcuts: [
    {
      btn: 'px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700'
    }
  ]
})
