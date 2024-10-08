import { defineStore } from 'pinia'

export const useTabsStore = defineStore({
  id: 'tabs-store',
  state: () => ({
    tabs: [
      {
        id: 1,
        title: '新标签页',
        loading: true
        // favicon: 'https://www.baidu.com/favicon.ico'
      },
      {
        id: 2,
        title: '新标签页新标签页新标签页新标签页新标签页新标签页',
        loading: false,
        favicon: 'https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png'
      },
      {
        id: 3,
        title: '新标签页',
        loading: true
        // favicon: 'https://www.52pojie.cn/favicon.ico'
      },
      {
        id: 4,
        title: '新标签页',
        loading: false,
        favicon: 'https://www.52pojie.cn/favicon.ico'
      }
    ],
    width: 240,
    current: 2
  }),
  actions: {}
})
