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

  public mainPreload = join(this.preload, 'main.js')
  public viewPreload = join(this.preload, 'view.js')

  // public stateFile = dataPath + '/window-state.json'
  // public storagePath = dataPath + '/storage'
  // public extensionPath = dataPath + '/extensions'

  open() {
    let index = join(this.renderer, 'main.html')
    if (process.env['ELECTRON_MODE'] === 'dev') {
      index = 'http://localhost:2333'
    }
    const args: Args = {
      index: index,
      bounds: {
        x: 80,
        y: 80,
        width: 1200,
        height: 800
      }
    }
    args.preload = this.mainPreload // 添加 preload 脚本
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
