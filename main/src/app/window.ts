import { BaseWindow, WebContentsView } from 'electron'

import { App } from '@/app'

import { register } from '@/app/event'

import { DialogManager } from '@/app/views/dialog-manager'
import { WebviewManager } from '@/app/views/webview-manager'

export interface Args {
  index: string
  bounds?: Bounds
  preload?: string
}

export class Window {
  public app: App
  public window: BaseWindow
  public webview: WebContentsView

  public dialogManager: DialogManager
  public webviewManager: WebviewManager

  constructor(app: App, args: Args) {
    this.app = app

    const { index, preload, bounds } = args
    this.window = new BaseWindow({
      frame: false,
      x: bounds ? bounds.x : 120,
      y: bounds ? bounds.y : 120,
      width: bounds ? bounds.width : 1200,
      height: bounds ? bounds.height : 800,
      minWidth: 720,
      minHeight: 480
    })

    register(this)
    if (bounds && bounds.maximized) {
      this.window.maximize()
    }

    // 主视图
    this.webview = new WebContentsView({
      webPreferences: {
        preload: preload,
        nodeIntegration: true,
        contextIsolation: true
      }
    })

    // 加载主视图
    this.setBounds()
    this.webContents.loadFile(index).then(() => {
      this.setupListener()
      this.webContents.openDevTools({ mode: 'detach' })
    })
    this.contentView.addChildView(this.webview)

    // 初始化对话框管理器
    this.dialogManager = new DialogManager(this)

    // 初始化 浏览器视图 管理器
    this.webviewManager = new WebviewManager(this)
  }

  setBounds() {
    const { width, height } = this.window.getBounds()
    this.webview.setBounds({ x: 0, y: 0, width: width, height: height })
  }

  setupListener() {
    this.window.on('close', () => {
      this.dialogManager.destroy()
      this.webviewManager.destroy()

      this.app.windows.delete(this.id)

      // TODO: 保存当前窗口状态
    })

    this.window.on('closed', () => {
      // 销毁窗口
      this.window.destroy()
    })

    this.window.on('focus', () => {
      // 设置当前窗口为当前窗口
      this.app.currentWindow = this
    })

    this.window.on('resize', () => {
      this.setBounds()
      this.webviewManager.setBounds()
    })

    this.window.on('restore', () => {
      this.webContents.send('main:window:on-unmaximize')
    })
    this.window.on('maximize', () => {
      this.webContents.send('main:window:on-maximize')
    })
    this.window.on('unmaximize', () => {
      this.webContents.send('main:window:on-unmaximize')
    })

    this.window.on('enter-full-screen', () => {
      this.webviewManager.fullscreen = true
      this.webviewManager.setBounds()
    })

    this.window.on('leave-full-screen', () => {
      this.webviewManager.fullscreen = false
      this.webviewManager.setBounds()
    })
  }

  get id() {
    return this.window.id
  }

  get webContents() {
    return this.webview.webContents
  }

  get contentView() {
    return this.window.contentView
  }

  get contentBounds() {
    return this.window.getContentBounds()
  }
}
