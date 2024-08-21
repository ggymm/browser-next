console.log(window['electron'])

const ipc = window['electron']['ipcRenderer']
if (!ipc) {
  console.error('Electron IPC not available')
}

function close() {
  ipc['send']('renderer:window:close')
}

function restore() {
  ipc['send']('renderer:window:restore')
}

function minimize() {
  ipc['send']('renderer:window:minimize')
}

function maximize() {
  ipc['send']('renderer:window:maximize')
}
