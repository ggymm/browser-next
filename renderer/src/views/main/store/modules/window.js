import { defineStore } from 'pinia'

import { on, close, restore, minimize, maximize } from '@/electron/window.js'

export const useWindowStore = defineStore({
  id: 'window-store',
  state: () => ({
    maximized: false
  }),
  actions: {
    init() {
      on((maximized) => {
        this.maximized = maximized
      })
    },
    close() {
      close()
    },
    restore() {
      restore()
    },
    minimize() {
      minimize()
    },
    maximize() {
      maximize()
    }
  }
})
