import { session } from 'electron'

import { App } from '@/app'
import { registerProtocol } from '@/app/scheme'

export class WindowSession {
  public view = session.fromPartition('persist:webview')
  public viewIncognito = session.fromPartition('incognito:webview')

  constructor(app: App) {
    registerProtocol(app, this.view)
  }
}
