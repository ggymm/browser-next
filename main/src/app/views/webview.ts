import { WebContentsView } from 'electron'

import { App } from '@/app'
import { getUserAgent } from '@/utils/user-agent'

export interface Args {
  key: string
  url: string
  active?: boolean
}

export class Webview {
  public view: WebContentsView
  public key: string = ''
  public bounds: Bounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  error: boolean = false
  favicon: string = ''

  lastUrl: string = ''
  originUrl: string = ''

  historyId: number = 0
  historyUrl: string = ''

  constructor(app: App, args: Args) {
    this.key = args.key
    this.view = new WebContentsView({
      webPreferences: {
        preload: app.viewPreload,
        sandbox: true,
        plugins: true,
        partition: 'persist:webview',
        javascript: true,
        webSecurity: true,
        nodeIntegration: false,
        contextIsolation: true
      }
    })
    this.view.setBackgroundColor('#FFFFFFFF')
    this.webContents.userAgent = getUserAgent()

    this.webContents.loadURL(args.url).then(() => {})

    this.setupListener()
  }

  reload() {
    this.webContents.reload()
  }

  destroy() {
    ;(this.webContents as any).destroy()
  }

  setBounds(bounds: Bounds) {
    this.bounds = bounds
    this.view.setBounds(bounds)
  }

  setupListener() {}

  updateBookmarkState() {}

  updateNavigationState() {}

  get webContents() {
    return this.view.webContents
  }
}
