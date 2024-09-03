import { defineStore } from 'pinia'

export const useTabsStore = defineStore({
  id: 'tabs-store',
  state: () => ({
    tabs: [],
    current: 2,
    minWidth: 120,
    maxWidth: 240
  }),
  actions: {
    init() {
      this['tabs'] = []
      this['tabs'].push(
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
      )
    }
  }
})
