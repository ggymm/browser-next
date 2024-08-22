import { WebContentsView } from 'electron'

import { App } from '@/app'
import { Window } from '@/app/window'

import { getUserAgent } from '@/utils/user-agent'
import { getWebErrorBaseURL } from '@/app/scheme'

import { recordFavicon, recordHistory } from '@/data'

export interface Args {
  key: string
  url: string
  active?: boolean
}

export class Webview {
  public key: string = ''
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

  public title: string = ''
  public originURL: string = ''
  public currentURL: string = ''

  constructor(window: Window, args: Args) {
    this.key = args.key
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
    this.webContents.userAgent = getUserAgent()
    this.webContents.loadURL(args.url).then(() => {})

    // 注册监听事件
    this.setupListener()
  }

  reload() {
    if (!this.error) {
      this.webContents.reload()
    } else {
      this.webContents.loadURL(this.currentURL).then(() => {})
    }
  }

  destroy() {
    ;(this.webContents as any).destroy()
  }

  setBounds(bounds: IBounds) {
    this.bounds = bounds
    this.webview.setBounds(bounds)
  }

  setupListener() {
    const notify = (event: string, args: any) => {
      this.window.webContents.send('main:webview:state:update', {
        key: this.key,
        args: args,
        event: event
      })
    }

    const updateURL = (url: string) => {
      this.currentURL = url
      notify('url', url)
      this.updateBookmarkState()
      console.log('updateURL', this.currentURL)
    }

    const updateTitle = (title: string) => {
      this.title = title
      notify('title', title)
      console.log('updateTitle', this.currentURL, title)
    }

    const updateFavicon = (favicon: string) => {
      this.favicon = favicon
      notify('favicon', favicon)

      // 执行保存数据库操作
      recordFavicon({
        url: this.currentURL,
        favicon: favicon
      })
    }

    // 监听加载完成
    this.webContents.addListener('did-finish-load', async () => {
      recordHistory({
        url: this.currentURL,
        title: this.title,
        favicon: this.favicon
      })
    })

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

      updateURL(this.url)
      this.updateNavigationState()
    })

    // 监听加载完成
    this.webContents.addListener('did-stop-loading', async () => {
      updateURL(this.url)
      this.updateNavigationState()
    })

    // 监听 title 改变
    this.webContents.addListener('page-title-updated', async (_, title) => {
      updateURL(this.url)
      updateTitle(title)
    })

    // 监听 favicon 改变
    this.webContents.addListener('page-favicon-updated', async (_, favicons) => {
      updateURL(this.url)
      updateFavicon(favicons[0])
    })

    // 监听导航开始
    this.webContents.addListener('did-start-navigation', async (_, url) => {
      updateURL(url)
      this.updateNavigationState()
    })

    // 监听导航完成
    this.webContents.addListener('did-navigate', async (_, url) => {
      updateURL(url)
      this.updateNavigationState()
    })

    // 监听 hash 导航
    this.webContents.addListener('did-navigate-in-page', async (_, url, isMainFrame) => {
      if (!isMainFrame) {
        return
      }

      updateURL(url)
      this.updateNavigationState()
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
    this.window.webContents.send('main:webview:state:update', {
      key: this.key,
      args: this.webContents.isLoading(),
      event: 'loading'
    })
    this.window.webContents.send('main:webview:navigation:update', {
      canGoBack: this.webContents.canGoBack(),
      canGoForward: this.webContents.canGoForward(),
      canReload: !this.webContents.isLoading()
    })
  }

  get url() {
    return this.webContents.getURL()
  }

  get webContents() {
    return this.webview.webContents
  }
}
