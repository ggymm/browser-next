import { release } from 'os'

import { app } from 'electron'

import { mainApp } from './app'

if (release().startsWith('6.1')) {
  app.disableHardwareAcceleration()
}
if (process.platform === 'win32') {
  app.setAppUserModelId(app.getName())
}

const setupApp = () => {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // 暂时忽略ssl证书问题
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault()
    callback(true)
  })

  mainApp.start()
}

setupApp()
