export const onEvent = (event, callback) => {
  if (!window['electron']) {
    console.error('Electron not available')
    return
  }

  const ipc = window['electron']['ipcRenderer']
  if (!ipc) {
    console.error('Electron IPC not available')
    return
  }
  ipc['on'](event, callback)
}

export const sendEvent = (event, ...args) => {
  if (!window['electron']) {
    console.error('Electron not available')
    return
  }

  const ipc = window['electron']['ipcRenderer']
  if (!ipc) {
    console.error('Electron IPC not available')
    return
  }
  ipc['send'](event, ...args)
}

export function sendEventSync(event, ...args) {
  if (!window['electron']) {
    console.error('Electron not available')
    return
  }

  const ipc = window['electron']['ipcRenderer']
  if (!ipc) {
    console.error('Electron IPC not available')
    return
  }

  return ipc['sendSync'](event, ...args)
}
