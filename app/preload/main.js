/*! build version 2024-11-22 15:26:36 */
"use strict";var e=require("electron");e.contextBridge.exposeInMainWorld("electron",{ipcRenderer:{on:e.ipcRenderer.on.bind(e.ipcRenderer),once:e.ipcRenderer.once.bind(e.ipcRenderer),send:e.ipcRenderer.send.bind(e.ipcRenderer),sendSync:e.ipcRenderer.sendSync.bind(e.ipcRenderer),removeAllListeners:e.ipcRenderer.removeAllListeners.bind(e.ipcRenderer)}});
