import { App } from '@/app'
import { Window } from '@/app/window'

export class DialogManager {
  app: App
  window: Window

  constructor(window: Window) {
    this.app = window.app
    this.window = window
  }

  destroy() {
    console.log('destroy')
  }
}
