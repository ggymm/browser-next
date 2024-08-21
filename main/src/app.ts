import { join } from 'path'

import { app, Menu } from 'electron'

import { Args, Window } from '@/app/window.js'

export const appPath = app.getAppPath()
export const dataPath = join(app.getPath('userData'), 'app')

export class App {
  public windows = new Map<number, Window>()
  public currentWindow: Window | null = null

  public mainPreload = appPath + '/preload/main.js'
  public viewPreload = appPath + '/preload/view.js'
  public mainRenderer = appPath + '/renderer/main.html'

  public stateFile = dataPath + '/window-state.json'
  public storagePath = dataPath + '/storage'
  public extensionPath = dataPath + '/extensions'

  open() {
    const args: Args = {
      index: this.mainRenderer,
      preload: this.mainPreload,
      bounds: {
        x: 80,
        y: 80,
        width: 1200,
        height: 800
      }
    }
    const window = new Window(mainApp, args)
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
