import path from 'path'

import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import { virtualHtmlTemplatePlugin } from './template'

const iconPath = path.resolve(process.cwd(), 'src/assets/svg')

export default [
  Icons({
    scale: 1,
    compiler: 'vue3',
    customCollections: {
      custom: FileSystemIconLoader(iconPath)
    },
    defaultClass: 'inline-block'
  }),
  Components({
    dts: false,
    resolvers: [IconsResolver({ componentPrefix: 'icon' })]
  }),
  createSvgIconsPlugin({
    inject: 'body-last',
    iconDirs: [iconPath],
    symbolId: 'icon-[dir]-[name]',
    customDomId: '__CUSTOM_SVG_ICON__'
  }),
  virtualHtmlTemplatePlugin({
    pages: {
      main: {
        title: 'Browser Main',
        entry: `src/views/main/main.js`
      },
      newtab: {
        title: 'Browser Newtab',
        entry: `src/views/newtab/main.js`
      }
    }
  })
]
