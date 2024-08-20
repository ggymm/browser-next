import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        ...ipcRenderer,
        on: ipcRenderer.on.bind(ipcRenderer),
        once: ipcRenderer.once.bind(ipcRenderer),
        removeAllListeners: ipcRenderer.removeAllListeners.bind(ipcRenderer)
    }
})