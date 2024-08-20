import { join } from 'path'

import { app, Menu } from 'electron'

import { Window } from '@/app/window.js'

export const appPath = app.getAppPath()
export const dataPath = join(app.getPath('userData'), 'app')

export class App {
  public windows = new Map<number, Window>()
  public currentWindow: Window | null = null

  public index = appPath + '/renderer/main.html'
  public preload = appPath + '/preload/main.js'

  public stateFile = dataPath + '/window-state.json'
  public storagePath = dataPath + '/storage'
  public extensionPath = dataPath + '/extensions'

  open() {
    const ops: WindowOps = {
      index: this.index,
      preload: this.preload,
      bounds: { width: 1200, height: 800 }
    }
    const window = new Window(mainApp, ops)
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

export const mainApp = new App()
