import { ipcMain } from 'electron'

import { getUserAgent } from '@/utils/user-agent'

export const registerDebug = () => {
  ipcMain.on('debug:user-agent', (event) => {
    event.returnValue = getUserAgent()
  })
}
