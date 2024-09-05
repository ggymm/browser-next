import { ref } from 'vue'

import { on, close, restore, minimize, maximize } from '@/electron/window.js'

export const useWindow = () => {
  const maximized = ref(false)

  on((res) => {
    maximized.value = res
  })

  const closeWindow = () => {
    close()
  }

  const restoreWindow = () => {
    restore()
  }

  const minimizeWindow = () => {
    minimize()
  }

  const maximizeWindow = () => {
    maximize()
  }

  return {
    maximized,
    closeWindow,
    restoreWindow,
    minimizeWindow,
    maximizeWindow
  }
}
