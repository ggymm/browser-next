import { ipcMain, IpcMainEvent } from 'electron'

import { App } from '@/app'
import { Window } from '@/app/window'

export const registerWebview = (app: App) => {
  const window = (event: IpcMainEvent): Window | undefined => {
    return app.windows.get(event.frameId)
  }

  // 关闭
  ipcMain.on('renderer:webview:close', (event, args) => {
    window(event)?.webviewManager.close(args)
  })
  // 创建
  ipcMain.on('renderer:webview:create', (event, args) => {
    window(event)?.webviewManager.create(args)
  })
  // 切换
  ipcMain.on('renderer:webview:select', (event, args) => {
    window(event)?.webviewManager.select(args)
  })

  // 设置 margin
  ipcMain.on('renderer:webview:update:margin', (event, args) => {
    window(event)?.webviewManager.setMargin(args)
  })

  // 停止加载
  ipcMain.on('renderer:webview:control:stop', (event) => {
    window(event)?.webviewManager.selected?.webContents.stop()
  })
  // 重新加载
  ipcMain.on('renderer:webview:control:reload', (event) => {
    window(event)?.webviewManager.selected?.webContents.reload()
  })
  // 后退
  ipcMain.on('renderer:webview:control:go-back', (event) => {
    window(event)?.webviewManager.selected?.webContents.goBack()
  })
  // 前进
  ipcMain.on('renderer:webview:control:go-forward', (event) => {
    window(event)?.webviewManager.selected?.webContents.goForward()
  })
}
