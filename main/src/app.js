import { join } from 'path'

import { app, Menu } from 'electron'
import { AppWindow } from './app/window.js'

export const appPath = app.getAppPath()
export const dataPath = join(app.getPath('userData'), 'app')

export const mainApp = new App()

class App {
  windows = new Map()
  constructor() {}

  setup() {}

  open() {
    const window = new AppWindow({
      index: join(appPath, 'renderer', 'index.html')
    })
    this.windows.set(window.id, window)
  }

  start() {
    if (!app.requestSingleInstanceLock()) {
      app.quit()
      return
    }

    Menu.setApplicationMenu(null)
    app.whenReady().then(() => {
      this.open()
    })
  }
}
