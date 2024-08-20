import { App } from '@/app'
import { Window } from '@/app/window'
import { Webview } from '@/app/views/webview'

export class WebviewManager {
  app: App
  window: Window

  margin: Margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }

  views = new Map<string, Webview>()

  selected: Webview | null = null
  fullscreen = false

  constructor(window: Window) {
    this.app = window.app
    this.window = window
  }

  close() {}

  cache(key: string, view: Webview) {
    if (this.views.get(key) === view) {
      return
    }
    this.views.set(key, view)
  }

  create(ops: WebviewOps) {
    const view = new Webview(this.app, ops)
    if (ops.active) {
    }
  }

  updateView(key: string, view: Webview) {
    if (this.selected && this.selected !== view) {
      this.window.contentView.removeChildView(this.selected.view)
    }
  }

  setBounds() {}
}
