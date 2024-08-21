import { app } from 'electron'

const regex: [string | RegExp, string][] = [
  [/ Electron\\?.(\S+)/, ''],
  [` ${app.name}/${app.getVersion()}`, ''],
  [/Chrome\/(\d+)\.[^ ]*/, 'Chrome/$1.0.0.0']
]

export const getUserAgent = (): string => {
  let userAgent = app.userAgentFallback
  regex.forEach((r) => {
    userAgent = userAgent.replace(r[0], r[1])
  })
  return userAgent
}
