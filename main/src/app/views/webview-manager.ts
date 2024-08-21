import { App } from '@/app'
import { Window } from '@/app/window'
import { Args, Webview } from '@/app/views/webview'

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

  destroy() {
    this.views.forEach((view: Webview) => view.destroy())
  }

  close(args: Args) {
    const view = this.views.get(args.key)
    if (!view) {
      return
    }
    view.destroy()
    this.views.delete(args.key)
  }

  create(args: Args) {
    const view = new Webview(this.app, args)
    if (!args.active) {
      // 仅缓存
      this.cacheWebview(args.key, view)
      return
    }

    // 更新视图
    this.updateWebview(args.key, view)
  }

  select(args: Args) {
    const view = this.views.get(args.key)
    if (!view || view === this.selected) {
      // 视图不存在 或 视图与当前视图相同
      return
    }

    // 更新视图
    this.updateWebview(args.key, view)
  }

  update(args: Args) {
    if (!this.selected) {
      return
    }

    // 需要删除当前视图
    args.key = this.selected.key
    this.selected.destroy()

    const view = new Webview(this.app, args)

    // 更新视图
    this.updateWebview(args.key, view)
  }

  setBounds() {
    if (!this.selected) {
      return
    }

    const { top, left, right, bottom } = this.margin
    const { width, height } = this.window.contentBounds
    this.selected.setBounds({
      x: this.fullscreen ? 0 : left,
      y: this.fullscreen ? 0 : top,
      width: width - right,
      height: this.fullscreen ? height : height - top - bottom
    })
  }

  setMargin(margin: Margin) {
    if (margin.top != undefined) {
      this.margin.top = margin.top
    }
    if (margin.left != undefined) {
      this.margin.left = margin.left
    }
    if (margin.right != undefined) {
      this.margin.right = margin.right
    }
    if (margin.bottom != undefined) {
      this.margin.bottom = margin.bottom
    }

    // 刷新
    if (margin.refresh) {
      this.setBounds()
    }
  }

  cacheWebview(key: string, view: Webview) {
    if (!this.views.has(key) || this.views.get(key) !== view) {
      this.views.set(key, view)
    }
  }

  updateWebview(key: string, view: Webview) {
    if (this.selected && this.selected !== view) {
      this.window.contentView.removeChildView(this.selected.view)
    }
    this.window.webContents.focus()
    this.window.contentView.addChildView(view.view)

    // 设置选中
    this.selected = view
    this.setBounds()
    this.cacheWebview(key, view)

    // 更新书签状态
    this.selected.updateBookmarkState()

    // 更新导航信息
    this.selected.updateNavigationState()
  }
}
