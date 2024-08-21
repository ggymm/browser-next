import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    on: ipcRenderer.on.bind(ipcRenderer),
    once: ipcRenderer.once.bind(ipcRenderer),
    send: ipcRenderer.send.bind(ipcRenderer),
    sendSync: ipcRenderer.sendSync.bind(ipcRenderer),
    removeAllListeners: ipcRenderer.removeAllListeners.bind(ipcRenderer),
  },
});
