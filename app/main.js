'use strict';

var os = require('os');
var electron = require('electron');
var path = require('path');

const register = (window) => {
    const { app } = window;
    registerWindowEvent(app);
    console.log('register');
};
const registerWindowEvent = (app) => {
    const window = () => {
        const base = electron.BaseWindow.getFocusedWindow();
        if (!base)
            return null;
        const window = app.windows.get(base.id);
        if (!window)
            return null;
        return window;
    };
    // 刷新窗口
    electron.ipcMain.on('renderer:window-handle:reload', () => {
        // 移除所有视图
        window()?.webviewManager.close();
        window()?.webContents.reloadIgnoringCache();
        // 重新加载数据
    });
    // 关闭窗口
    electron.ipcMain.on('renderer:window:close', () => {
        window()?.window.close();
    });
    // 还原窗口
    electron.ipcMain.on('renderer:window:restore', () => {
        window()?.window.restore();
    });
    // 最小化窗口
    electron.ipcMain.on('renderer:window:minimize', () => {
        window()?.window.minimize();
    });
    // 最大化窗口
    electron.ipcMain.on('renderer:window:maximize', () => {
        window()?.window.maximize();
    });
};

class DialogManager {
    app;
    window;
    constructor(window) {
        this.app = window.app;
        this.window = window;
    }
    close() {
        console.log('close');
    }
}

class Webview {
    view;
    constructor(app, ops) {
        this.view = new electron.WebContentsView({
            webPreferences: {
                preload: app.preload,
                nodeIntegration: true,
                contextIsolation: true
            }
        });
    }
}

class WebviewManager {
    app;
    window;
    margin = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    views = new Map();
    selected = null;
    fullscreen = false;
    constructor(window) {
        this.app = window.app;
        this.window = window;
    }
    close() { }
    cache(key, view) {
        if (this.views.get(key) === view) {
            return;
        }
        this.views.set(key, view);
    }
    create(ops) {
        new Webview(this.app, ops);
        if (ops.active) ;
    }
    updateView(key, view) {
        if (this.selected && this.selected !== view) {
            this.window.contentView.removeChildView(this.selected.view);
        }
    }
    setBounds() { }
}

class Window {
    app;
    window;
    webview;
    dialogManager;
    webviewManager;
    constructor(app, ops) {
        this.app = app;
        const { index, preload, bounds } = ops;
        this.window = new electron.BaseWindow({
            frame: false,
            x: bounds ? bounds.x : 100,
            y: bounds ? bounds.y : 100,
            width: bounds ? bounds.width : 1200,
            height: bounds ? bounds.height : 800,
            minWidth: 720,
            minHeight: 480
        });
        register(this);
        if (bounds && bounds.maximized) {
            this.window.maximize();
        }
        // 主视图
        this.webview = new electron.WebContentsView({
            webPreferences: {
                preload: preload,
                nodeIntegration: true,
                contextIsolation: true
            }
        });
        // 加载主视图
        this.setBounds();
        this.webContents.loadFile(index).then(() => {
            this.setupListener();
            this.webContents.openDevTools({ mode: 'detach' });
        });
        this.contentView.addChildView(this.webview);
        // 初始化对话框管理器
        this.dialogManager = new DialogManager(this);
        // 初始化 浏览器视图 管理器
        this.webviewManager = new WebviewManager(this);
    }
    setBounds() {
        const { width, height } = this.window.getBounds();
        this.webview.setBounds({ x: 0, y: 0, width: width, height: height });
    }
    setupListener() {
        this.window.on('close', () => {
            this.dialogManager.close();
            this.webviewManager.close();
            this.app.windows.delete(this.id);
            // TODO: 保存当前窗口状态
        });
        this.window.on('closed', () => {
            // 销毁窗口
            this.window.destroy();
        });
        this.window.on('focus', () => {
            // 设置当前窗口为当前窗口
            this.app.currentWindow = this;
        });
        this.window.on('resize', () => {
            this.setBounds();
            this.webviewManager.setBounds();
        });
        this.window.on('restore', () => {
            this.webContents.send('main:window:on-unmaximize');
        });
        this.window.on('maximize', () => {
            this.webContents.send('main:window:on-maximize');
        });
        this.window.on('unmaximize', () => {
            this.webContents.send('main:window:on-unmaximize');
        });
        this.window.on('enter-full-screen', () => {
            this.webviewManager.fullscreen = true;
            this.webviewManager.setBounds();
        });
        this.window.on('leave-full-screen', () => {
            this.webviewManager.fullscreen = false;
            this.webviewManager.setBounds();
        });
    }
    get id() {
        return this.window.id;
    }
    get contentView() {
        return this.window.contentView;
    }
    get webContents() {
        return this.webview.webContents;
    }
}

const appPath = electron.app.getAppPath();
const dataPath = path.join(electron.app.getPath('userData'), 'app');
class App {
    windows = new Map();
    currentWindow = null;
    index = appPath + '/renderer/main.html';
    preload = appPath + '/preload/main.js';
    stateFile = dataPath + '/window-state.json';
    storagePath = dataPath + '/storage';
    extensionPath = dataPath + '/extensions';
    open() {
        const ops = {
            index: this.index,
            preload: this.preload,
            bounds: { width: 1200, height: 800 }
        };
        const window = new Window(mainApp, ops);
        this.windows.set(window.id, window);
    }
    start() {
        if (!electron.app.requestSingleInstanceLock()) {
            electron.app.quit();
            return;
        }
        electron.Menu.setApplicationMenu(null);
        electron.app.whenReady().then(() => {
            this.open();
        });
    }
    fromWindow(window) {
        this.windows.forEach((win) => {
            if (win.window === window) {
                return win;
            }
        });
        return null;
    }
}
const mainApp = new App();

if (os.release().startsWith('6.1')) {
    electron.app.disableHardwareAcceleration();
}
if (process.platform === 'win32') {
    electron.app.setAppUserModelId(electron.app.getName());
}
const setupApp = () => {
    electron.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electron.app.quit();
        }
    });
    // 暂时忽略ssl证书问题
    electron.app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        event.preventDefault();
        callback(true);
    });
    mainApp.start();
};
setupApp();
//# sourceMappingURL=main.js.map
