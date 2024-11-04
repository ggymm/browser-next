import { join } from 'path'

import { app, Menu } from 'electron'

import { Args, Window } from '@/app/window.js'
import { WindowSession } from '@/app/window-session'

export const appPath = app.getAppPath()
export const dataPath = join(app.getPath('userData'), 'app')

export class App {
  public session: WindowSession | null = null
  public windows = new Map<number, Window>()

  public preload = join(appPath, 'preload')
  public renderer = join(appPath, 'renderer')

  public mainPreload = this.preload + '/main.js'
  public viewPreload = this.preload + '/view.js'
  public mainRenderer = this.renderer + '/main.html'

  // public stateFile = dataPath + '/window-state.json'
  // public storagePath = dataPath + '/storage'
  // public extensionPath = dataPath + '/extensions'

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

      this.session = new WindowSession(this)
    })
  }
}

export const mainApp = new App()
