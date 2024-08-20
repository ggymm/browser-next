import { WebContentsView } from 'electron'

import { App } from '@/app'

export class Webview {
  public view: WebContentsView

  constructor(app: App, ops: WebviewOps) {
    this.view = new WebContentsView({
      webPreferences: {
        preload: app.preload,
        nodeIntegration: true,
        contextIsolation: true
      }
    })
  }
}
