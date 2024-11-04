'use strict'
var e = require('os'),
  t = require('electron'),
  i = require('path')
const n = [
    [/ Electron\\?.(\S+)/, ''],
    [` ${t.app.name}/${t.app.getVersion()}`, ''],
    [/Chrome\/(\d+)\.[^ ]*/, 'Chrome/$1.0.0.0']
  ],
  s = () => {
    let e = t.app.userAgentFallback
    return (
      n.forEach((t) => {
        e = e.replace(t[0], t[1])
      }),
      e
    )
  },
  o = (e) => {
    const { app: i } = e
    a(i),
      t.ipcMain.on('debug:user-agent', (e) => {
        e.returnValue = s()
      }),
      ((e) => {
        const i = (t) => e.windows.get(t.frameId)
        t.ipcMain.on('renderer:webview:close', (e, t) => {
          i(e)?.webviewManager.close(t)
        }),
          t.ipcMain.on('renderer:webview:create', (e, t) => {
            i(e)?.webviewManager.create(t)
          }),
          t.ipcMain.on('renderer:webview:select', (e, t) => {
            i(e)?.webviewManager.select(t)
          }),
          t.ipcMain.on('renderer:webview:update:margin', (e, t) => {
            i(e)?.webviewManager.setMargin(t)
          }),
          t.ipcMain.on('renderer:webview:control:stop', (e) => {
            i(e)?.webviewManager.selected?.webContents.stop()
          }),
          t.ipcMain.on('renderer:webview:control:reload', (e) => {
            i(e)?.webviewManager.selected?.webContents.reload()
          }),
          t.ipcMain.on('renderer:webview:control:go-back', (e) => {
            i(e)?.webviewManager.selected?.webContents.goBack()
          }),
          t.ipcMain.on('renderer:webview:control:go-forward', (e) => {
            i(e)?.webviewManager.selected?.webContents.goForward()
          })
      })(i)
  },
  a = (e) => {
    const i = (t) => e.windows.get(t.frameId)
    t.ipcMain.on('renderer:window-handle:reload', (e) => {
      i(e)?.webviewManager.destroy(), i(e)?.webContents.reloadIgnoringCache()
    }),
      t.ipcMain.on('renderer:window:close', (e) => {
        i(e)?.window.close()
      }),
      t.ipcMain.on('renderer:window:restore', (e) => {
        i(e)?.window.restore()
      }),
      t.ipcMain.on('renderer:window:minimize', (e) => {
        i(e)?.window.minimize()
      }),
      t.ipcMain.on('renderer:window:maximize', (e) => {
        i(e)?.window.maximize()
      })
  }

class r {
  app
  window

  constructor(e) {
    ;(this.app = e.app), (this.window = e)
  }

  destroy() {
    console.log('destroy')
  }
}

const w = 'app-error'

class d {
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

  constructor(e, i) {
    ;(this.id = i.id),
      (this.app = e.app),
      (this.window = e),
      (this.webview = new t.WebContentsView({
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
      (this.webContents.userAgent = s()),
      this.webContents.loadURL(i.url).then(() => {}),
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
            return `${w}://network-error?url=${e}&host=${n}&code=${t}&description=${i}`
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

class h {
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
    const t = new d(this.window, e)
    e.active ? this.updateWebview(e.id, t) : this.cacheWebview(e.id, t)
  }

  select(e) {
    const t = this.views.get(e.id)
    t && t !== this.selected && this.updateWebview(e.id, t)
  }

  update(e) {
    if (!this.selected) return
    ;(e.id = this.selected.id), this.selected.destroy()
    const t = new d(this.window, e)
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

class l {
  app
  window
  webview
  dialogManager
  webviewManager

  constructor(e, i) {
    this.app = e
    const { index: n, preload: s, bounds: a } = i
    ;(this.window = new t.BaseWindow({
      frame: !1,
      x: a ? a.x : 120,
      y: a ? a.y : 120,
      width: a ? a.width : 1200,
      height: a ? a.height : 800,
      minWidth: 720,
      minHeight: 480
    })),
      o(this),
      a && a.maximized && this.window.maximize(),
      (this.webview = new t.WebContentsView({
        webPreferences: {
          preload: s,
          nodeIntegration: !0,
          contextIsolation: !0
        }
      })),
      this.setBounds(),
      this.webContents.loadFile(n).then(() => {
        this.setupListener(), this.webContents.openDevTools({ mode: 'detach' })
      }),
      this.contentView.addChildView(this.webview),
      (this.dialogManager = new r(this)),
      (this.webviewManager = new h(this))
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

class c {
  view = t.session.fromPartition('persist:webview')
  viewIncognito = t.session.fromPartition('incognito:webview')

  constructor(e) {
    ;((e, i) => {
      i.protocol.handle(w, () => t.net.fetch(`file:///${e.renderer}/network-error.html`)),
        i.protocol.handle('app', (i) => {
          const n = new URL(i.url)
          return t.net.fetch(`file:///${e.renderer}/${n.pathname}`)
        })
    })(e, this.view)
  }
}

const p = t.app.getAppPath()
i.join(t.app.getPath('userData'), 'app')
const u = new (class {
  session = null
  windows = new Map()
  preload = i.join(p, 'preload')
  renderer = i.join(p, 'renderer')
  mainPreload = this.preload + '/main.js'
  viewPreload = this.preload + '/view.js'
  mainRenderer = this.renderer + '/main.html'

  open() {
    const e = {
        index: this.mainRenderer,
        preload: this.mainPreload,
        bounds: { x: 80, y: 80, width: 1200, height: 800 }
      },
      t = new l(u, e)
    this.windows.set(t.id, t)
  }

  start() {
    t.app.requestSingleInstanceLock()
      ? (t.Menu.setApplicationMenu(null),
        t.app.whenReady().then(() => {
          this.open(), (this.session = new c(this))
        }))
      : t.app.quit()
  }
})()
e.release().startsWith('6.1') && t.app.disableHardwareAcceleration(), 'win32' === process.platform && t.app.setAppUserModelId(t.app.getName())
t.app.on('window-all-closed', () => {
  'darwin' !== process.platform && t.app.quit()
}),
  t.app.on('certificate-error', (e, t, i, n, s, o) => {
    e.preventDefault(), o(!0)
  }),
  u.start()
//# sourceMappingURL=main.js.map
