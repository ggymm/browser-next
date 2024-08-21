import { ipcMain, IpcMainEvent } from 'electron'

import { App } from '@/app'
import { Window } from '@/app/window'

import { registerDebug } from '@/app/event/debug'
import { registerDialog } from '@/app/event/dialog'
import { registerWebview } from '@/app/event/webview'

export const register = (window: Window) => {
  const { app } = window
  registerWindow(app)

  registerDebug()
  registerDialog(app)
  registerWebview(app)
}

const registerWindow = (app: App) => {
  const window = (event: IpcMainEvent): Window | undefined => {
    return app.windows.get(event.frameId)
  }

  // 刷新窗口
  ipcMain.on('renderer:window-handle:reload', (event) => {
    // 移除所有视图
    window(event)?.webviewManager.destroy()
    window(event)?.webContents.reloadIgnoringCache()

    // 重新加载数据
  })

  // 关闭窗口
  ipcMain.on('renderer:window:close', (event) => {
    window(event)?.window.close()
  })

  // 还原窗口
  ipcMain.on('renderer:window:restore', (event) => {
    window(event)?.window.restore()
  })

  // 最小化窗口
  ipcMain.on('renderer:window:minimize', (event) => {
    window(event)?.window.minimize()
  })

  // 最大化窗口
  ipcMain.on('renderer:window:maximize', (event) => {
    window(event)?.window.maximize()
  })
}
