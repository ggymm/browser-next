import logger, { log, info, warn, error, debug } from 'electron-log'

import { dataPath } from '@/app'

const logPath = dataPath + '/logs'
logger.transports.file.resolvePathFn = function () {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return logPath + `/app-${year}-${month}-${day}.log`
}

export const setupLog = () => {
  console.log = log
  console.info = info
  console.warn = warn
  console.error = error
  console.debug = debug
}
