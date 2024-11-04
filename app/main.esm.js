import { release as e } from 'os'
import { app as t, ipcMain as i, net as n, WebContentsView as s, BaseWindow as o, session as r, Menu as a } from 'electron'
import { join as w } from 'path'

const d = [
    [/ Electron\\?.(\S+)/, ''],
    [` ${t.name}/${t.getVersion()}`, ''],
    [/Chrome\/(\d+)\.[^ ]*/, 'Chrome/$1.0.0.0']
  ],
  h = () => {
    let e = t.userAgentFallback
    return (
      d.forEach((t) => {
        e = e.replace(t[0], t[1])
      }),
      e
    )
  },
  l = (e) => {
    const { app: t } = e
    c(t),
      i.on('debug:user-agent', (e) => {
        e.returnValue = h()
      }),
      ((e) => {
        const t = (t) => e.windows.get(t.frameId)
        i.on('renderer:webview:close', (e, i) => {
          t(e)?.webviewManager.close(i)
        }),
          i.on('renderer:webview:create', (e, i) => {
            t(e)?.webviewManager.create(i)
          }),
          i.on('renderer:webview:select', (e, i) => {
            t(e)?.webviewManager.select(i)
          }),
          i.on('renderer:webview:update:margin', (e, i) => {
            t(e)?.webviewManager.setMargin(i)
          }),
          i.on('renderer:webview:control:stop', (e) => {
            t(e)?.webviewManager.selected?.webContents.stop()
          }),
          i.on('renderer:webview:control:reload', (e) => {
            t(e)?.webviewManager.selected?.webContents.reload()
          }),
          i.on('renderer:webview:control:go-back', (e) => {
            t(e)?.webviewManager.selected?.webContents.goBack()
          }),
          i.on('renderer:webview:control:go-forward', (e) => {
            t(e)?.webviewManager.selected?.webContents.goForward()
          })
      })(t)
  },
  c = (e) => {
    const t = (t) => e.windows.get(t.frameId)
    i.on('renderer:window-handle:reload', (e) => {
      t(e)?.webviewManager.destroy(), t(e)?.webContents.reloadIgnoringCache()
    }),
      i.on('renderer:window:close', (e) => {
        t(e)?.window.close()
      }),
      i.on('renderer:window:restore', (e) => {
        t(e)?.window.restore()
      }),
      i.on('renderer:window:minimize', (e) => {
        t(e)?.window.minimize()
      }),
      i.on('renderer:window:maximize', (e) => {
        t(e)?.window.maximize()
      })
  }

class u {
  app
  window

  constructor(e) {
    ;(this.app = e.app), (this.window = e)
  }

  destroy() {
    console.log('destroy')
  }
}

const b = 'app-error'

class p {
  id = ''
  app
  window
  webview
  error = !1
  favicon = ''
  bounds = { x: 0, y: 0, width: 0, height: 0 }
  url = ''
  title = ''
  originURL = ''

  constructor(e, t) {
    ;(this.id = t.id),
      (this.app = e.app),
      (this.window = e),
      (this.webview = new s({
        webPreferences: {
          preload: this.app.viewPreload,
          sandbox: !0,
          plugins: !0,
          partition: 'persist:webview',
          javascript: !0,
          webSecurity: !0,
          nodeIntegration: !1,
          contextIsolation: !0
        }
      })),
      this.webview.setBackgroundColor('#FFFFFFFF'),
      this.updateWebview('loading', !0),
      (this.webContents.userAgent = h()),
      this.webContents.loadURL(t.url).then(() => {}),
      this.setupListener()
  }

  reload() {
    this.error ? this.webContents.loadURL(this.url).then(() => {}) : this.webContents.reload()
  }

  destroy() {
    this.webContents.destroy()
  }

  setBounds(e) {
    ;(this.bounds = e), this.webview.setBounds(e)
  }

  updateWebview = (e, t) => {
    this.window.webContents.send('main:webview:state:update', { id: this.id, args: t, event: e })
  }

  setupListener() {
    const e = (e) => {
      e || (e = this.webContents.getURL()),
        (this.url = e),
        this.updateBookmarkState(),
        this.error ? this.updateWebview('url', this.originURL) : this.updateWebview('url', this.url)
    }
    this.webContents.addListener('did-fail-load', async (e, t, i, n, s) => {
      s &&
        -3 != t &&
        ((this.error = !0),
        (this.originURL = n),
        console.error('browser-view did-fail-load', n, t, i),
        await this.webContents.loadURL(
          ((e, t, i) => {
            const n = new URL(e).host
            return `${b}://network-error?url=${e}&host=${n}&code=${t}&description=${i}`
          })(n, t, i)
        )),
        console.info('browser-view did-fail-load', t, i)
    }),
      this.webContents.addListener('did-start-loading', async () => {
        ;(this.error = !1), this.updateWebview('loading', !0), console.log('did-start-loading')
      }),
      this.webContents.addListener('did-stop-loading', async () => {
        this.updateWebview('loading', !1), console.log('did-stop-loading')
      }),
      this.webContents.addListener('page-title-updated', async (e, t) => {
        ;(this.title = t), this.updateWebview('title', t), console.log('page-title-updated', this.title)
      }),
      this.webContents.addListener('page-favicon-updated', async (e, t) => {
        var i, n
        ;(this.favicon = t[0]),
          (i = { url: this.url, favicon: this.favicon }),
          console.log(i),
          (n = {
            url: this.url,
            title: this.title,
            favicon: this.favicon
          }),
          console.log(n),
          this.updateWebview('favicon', this.favicon),
          console.log('page-favicon-updated', this.favicon)
      }),
      this.webContents.addListener('did-start-navigation', async ({ url: t, isMainFrame: i }) => {
        i && (e(t), this.updateNavigationState(), console.log('did-start-navigation', t))
      }),
      this.webContents.setWindowOpenHandler((e) => {
        const { url: t, frameName: i, disposition: n } = e
        if ('about:blank' == t) return { action: 'allow' }
        const s = () => {
          this.window.webContents.send('main:webview:create', { url: t, active: !0 })
        }
        return ('new-window' == n && '_blank' == i) || 'foreground-tab' == n || 'background-tab' == n
          ? (s(), { action: 'deny' })
          : { action: 'allow' }
      })
  }

  updateBookmarkState() {}

  updateNavigationState() {
    this.webContents.isDestroyed() ||
      (this.window.webviewManager.selected === this &&
        this.window.webContents.send('main:webview:navigation:update', {
          canGoBack: this.webContents.canGoBack(),
          canGoForward: this.webContents.canGoForward(),
          canReload: !this.webContents.isLoading()
        }))
  }

  get webContents() {
    return this.webview.webContents
  }
}

class g {
  app
  window
  margin = { top: 0, left: 0, right: 0, bottom: 0 }
  views = new Map()
  selected = null
  fullscreen = !1

  constructor(e) {
    ;(this.app = e.app), (this.window = e)
  }

  destroy() {
    this.views.forEach((e) => e.destroy())
  }

  close(e) {
    const t = this.views.get(e.id)
    t && (t.destroy(), this.views.delete(e.id))
  }

  create(e) {
    const t = new p(this.window, e)
    e.active ? this.updateWebview(e.id, t) : this.cacheWebview(e.id, t)
  }

  select(e) {
    const t = this.views.get(e.id)
    t && t !== this.selected && this.updateWebview(e.id, t)
  }

  update(e) {
    if (!this.selected) return
    ;(e.id = this.selected.id), this.selected.destroy()
    const t = new p(this.window, e)
    this.updateWebview(e.id, t)
  }

  setBounds() {
    if (!this.selected) return
    const { top: e, left: t, right: i, bottom: n } = this.margin,
      { width: s, height: o } = this.window.contentBounds
    this.selected.setBounds({
      x: this.fullscreen ? 0 : t,
      y: this.fullscreen ? 0 : e,
      width: s - i,
      height: this.fullscreen ? o : o - e - n
    })
  }

  setMargin(e) {
    null != e.top && (this.margin.top = e.top),
      null != e.left && (this.margin.left = e.left),
      null != e.right && (this.margin.right = e.right),
      null != e.bottom && (this.margin.bottom = e.bottom),
      e.refresh && this.setBounds()
  }

  cacheWebview(e, t) {
    ;(this.views.has(e) && this.views.get(e) === t) || this.views.set(e, t)
  }

  updateWebview(e, t) {
    this.selected && this.selected !== t && this.window.contentView.removeChildView(this.selected.webview),
      this.window.webContents.focus(),
      this.window.contentView.addChildView(t.webview),
      (this.selected = t),
      this.setBounds(),
      this.cacheWebview(e, t),
      this.selected.updateBookmarkState(),
      this.selected.updateNavigationState()
  }
}

class v {
  app
  window
  webview
  dialogManager
  webviewManager

  constructor(e, t) {
    this.app = e
    const { index: i, preload: n, bounds: r } = t
    ;(this.window = new o({
      frame: !1,
      x: r ? r.x : 120,
      y: r ? r.y : 120,
      width: r ? r.width : 1200,
      height: r ? r.height : 800,
      minWidth: 720,
      minHeight: 480
    })),
      l(this),
      r && r.maximized && this.window.maximize(),
      (this.webview = new s({
        webPreferences: {
          preload: n,
          nodeIntegration: !0,
          contextIsolation: !0
        }
      })),
      this.setBounds(),
      this.webContents.loadFile(i).then(() => {
        this.setupListener(), this.webContents.openDevTools({ mode: 'detach' })
      }),
      this.contentView.addChildView(this.webview),
      (this.dialogManager = new u(this)),
      (this.webviewManager = new g(this))
  }

  setBounds() {
    const { width: e, height: t } = this.window.getBounds()
    this.webview.setBounds({ x: 0, y: 0, width: e, height: t })
  }

  setupListener() {
    this.window.on('close', () => {
      this.dialogManager.destroy(), this.webviewManager.destroy(), this.app.windows.delete(this.id)
    }),
      this.window.on('closed', () => {
        this.window.destroy()
      }),
      this.window.on('focus', () => {}),
      this.window.on('resize', () => {
        this.setBounds(), this.webviewManager.setBounds()
      }),
      this.window.on('restore', () => {
        this.webContents.send('main:window:on-unmaximize')
      }),
      this.window.on('maximize', () => {
        this.webContents.send('main:window:on-maximize')
      }),
      this.window.on('unmaximize', () => {
        this.webContents.send('main:window:on-unmaximize')
      }),
      this.window.on('enter-full-screen', () => {
        ;(this.webviewManager.fullscreen = !0), this.webviewManager.setBounds()
      }),
      this.window.on('leave-full-screen', () => {
        ;(this.webviewManager.fullscreen = !1), this.webviewManager.setBounds()
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

class m {
  view = r.fromPartition('persist:webview')
  viewIncognito = r.fromPartition('incognito:webview')

  constructor(e) {
    ;((e, t) => {
      t.protocol.handle(b, () => n.fetch(`file:///${e.renderer}/network-error.html`)),
        t.protocol.handle('app', (t) => {
          const i = new URL(t.url)
          return n.fetch(`file:///${e.renderer}/${i.pathname}`)
        })
    })(e, this.view)
  }
}

const f = t.getAppPath()
w(t.getPath('userData'), 'app')
const C = new (class {
  session = null
  windows = new Map()
  preload = w(f, 'preload')
  renderer = w(f, 'renderer')
  mainPreload = this.preload + '/main.js'
  viewPreload = this.preload + '/view.js'
  mainRenderer = this.renderer + '/main.html'

  open() {
    const e = {
        index: this.mainRenderer,
        preload: this.mainPreload,
        bounds: { x: 80, y: 80, width: 1200, height: 800 }
      },
      t = new v(C, e)
    this.windows.set(t.id, t)
  }

  start() {
    t.requestSingleInstanceLock()
      ? (a.setApplicationMenu(null),
        t.whenReady().then(() => {
          this.open(), (this.session = new m(this))
        }))
      : t.quit()
  }
})()
e().startsWith('6.1') && t.disableHardwareAcceleration(), 'win32' === process.platform && t.setAppUserModelId(t.getName())
t.on('window-all-closed', () => {
  'darwin' !== process.platform && t.quit()
}),
  t.on('certificate-error', (e, t, i, n, s, o) => {
    e.preventDefault(), o(!0)
  }),
  C.start()
//# sourceMappingURL=main.esm.js.map
