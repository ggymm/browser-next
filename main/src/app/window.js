import { BrowserWindow } from 'electron'

/**
 * @typedef {Object} Options
 * @property {string} [index] - 加载页面的 URL 或者文件路径
 * @property {string} [preload] - 预加载的脚本路径
 * @property {number} [x] - 窗口的 x 坐标
 * @property {number} [y] - 窗口的 y 坐标
 * @property {number} [width] - 窗口的宽度
 * @property {number} [height] - 窗口的高度
 * @property {boolean} [maximized] - 是否最大化窗口
 * @property {boolean} [fullscreen] - 是否全屏化窗口
 */

export class AppWindow {
  window = null

  /**
   * @param ops {Options}
   */
  constructor(ops) {
    this.window = new BrowserWindow({
      frame: false,
      x: ops ? ops.x : null,
      y: ops ? ops.y : null,
      width: ops ? ops.width : 1200,
      height: ops ? ops.height : 800,
      minWidth: 720,
      minHeight: 480,
      webPreferences: {
        preload: ops ? ops.preload : null,
        nodeIntegration: true,
        contextIsolation: true
      }
    })

    if (ops && ops.maximized) {
      this.window.maximize()
    }

    this.window.loadFile(ops.index).then(() => {
      this.setup()
    })
  }

  setup() {}

  get id() {
    return this.window.id
  }

  get webContents() {
    return this.window.webContents
  }
}
