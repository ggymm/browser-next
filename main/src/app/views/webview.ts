import { WebContentsView } from 'electron'

import { App } from '@/app'
import { Window } from '@/app/window'

import { getUserAgent } from '@/utils/user-agent'
import { getWebErrorBaseURL } from '@/app/scheme'

import { createFavicon, createHistory } from '@/data'

export interface Args {
  id: string
  url: string
  active?: boolean
}

export class Webview {
  public id: string = ''
  public app: App
  public window: Window
  public webview: WebContentsView

  public error: boolean = false
  public favicon: string = ''
  public bounds: IBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  public url: string = ''
  public title: string = ''
  public originURL: string = ''

  constructor(window: Window, args: Args) {
    this.id = args.id
    this.app = window.app
    this.window = window
    this.webview = new WebContentsView({
      webPreferences: {
        preload: this.app.viewPreload,
        sandbox: true,
        plugins: true,
        partition: 'persist:webview',
        javascript: true,
        webSecurity: true,
        nodeIntegration: false,
        contextIsolation: true
      }
    })

    this.webview.setBackgroundColor('#FFFFFFFF')

    this.updateWebview('loading', true)
    this.webContents.userAgent = getUserAgent()
    this.webContents.loadURL(args.url).then(() => {})

    // 注册监听事件
    this.setupListener()
  }

  reload() {
    if (!this.error) {
      this.webContents.reload()
    } else {
      this.webContents.loadURL(this.url).then(() => {})
    }
  }

  destroy() {
    ;(this.webContents as any).destroy()
  }

  setBounds(bounds: IBounds) {
    this.bounds = bounds
    this.webview.setBounds(bounds)
  }

  updateWebview = (event: string, args: any) => {
    this.window.webContents.send('main:webview:state:update', {
      id: this.id,
      args: args,
      event: event
    })
  }

  // https://www.electronjs.org/zh/docs/latest/api/web-contents
  setupListener() {
    const updateURL = (url?: string) => {
      if (!url) {
        url = this.webContents.getURL()
      }
      this.url = url
      this.updateBookmarkState()
      if (!this.error) {
        this.updateWebview('url', this.url)
      } else {
        this.updateWebview('url', this.originURL)
      }
    }

    // 监听加载失败
    this.webContents.addListener('did-fail-load', async (_, errorCode, errorDescription, validatedURL, isMainFrame) => {
      // -3代表，用户手动终止了加载
      if (isMainFrame && errorCode != -3) {
        this.error = true
        this.originURL = validatedURL

        console.error('browser-view did-fail-load', validatedURL, errorCode, errorDescription)

        // 加载错误页面的URL
        await this.webContents.loadURL(getWebErrorBaseURL(validatedURL, errorCode, errorDescription))
      }
      console.info('browser-view did-fail-load', errorCode, errorDescription)
    })

    // 监听开始加载
    this.webContents.addListener('did-start-loading', async () => {
      this.error = false
      this.updateWebview('loading', true)
      console.log('did-start-loading')
    })

    // 监听加载完成
    this.webContents.addListener('did-stop-loading', async () => {
      this.updateWebview('loading', false)
      console.log('did-stop-loading')
    })

    // 监听 title 改变
    this.webContents.addListener('page-title-updated', async (_event, title) => {
      this.title = title
      this.updateWebview('title', title)
      console.log('page-title-updated', this.title)
    })

    // 监听 favicon 改变
    this.webContents.addListener('page-favicon-updated', async (_event, favicons) => {
      this.favicon = favicons[0]
      createFavicon({
        url: this.url,
        favicon: this.favicon
      })
      createHistory({
        url: this.url,
        title: this.title,
        favicon: this.favicon
      })
      this.updateWebview('favicon', this.favicon)
      console.log('page-favicon-updated', this.favicon)
    })

    this.webContents.addListener('did-start-navigation', async ({ url, isMainFrame }) => {
      if (!isMainFrame) {
        return
      }
      updateURL(url)
      this.updateNavigationState()
      console.log('did-start-navigation', url)
    })

    // 监听打开新窗口
    this.webContents.setWindowOpenHandler((details) => {
      const { url, frameName, disposition } = details
      if (url == 'about:blank') {
        return { action: 'allow' }
      }

      const create = () => {
        this.window.webContents.send('main:webview:create', { url: url, active: true })
      }

      if (disposition == 'new-window' && frameName == '_blank') {
        create()
        return { action: 'deny' }
      }
      if (disposition == 'foreground-tab' || disposition == 'background-tab') {
        create()
        return { action: 'deny' }
      }
      return { action: 'allow' }
    })
  }

  updateBookmarkState() {}

  updateNavigationState() {
    if (this.webContents.isDestroyed()) {
      return
    }

    if (this.window.webviewManager.selected !== this) {
      return
    }

    // 通知视图更新
    this.window.webContents.send('main:webview:navigation:update', {
      canGoBack: this.webContents.canGoBack(),
      canGoForward: this.webContents.canGoForward(),
      canReload: !this.webContents.isLoading()
    })
  }

  get webContents() {
    return this.webview.webContents
  }
}
