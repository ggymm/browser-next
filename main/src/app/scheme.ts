import { net, Session } from 'electron'

import { App } from '@/app'

export const WEBUI_PROTOCOL = 'app'

export const ERROR_PROTOCOL = 'app-error'

export const NETWORK_ERROR_HOST = 'network-error'

export const getWebBaseURL = (page: string) => {
  return `${WEBUI_PROTOCOL}://${page}.html`
}

export const getWebErrorBaseURL = (url: string, code: number, description: string) => {
  const host = new URL(url).host
  return `${ERROR_PROTOCOL}://${NETWORK_ERROR_HOST}?url=${url}&host=${host}&code=${code}&description=${description}`
}

export const registerProtocol = (app: App, session: Session) => {
  session.protocol.handle(ERROR_PROTOCOL, () => {
    return net.fetch(`file:///${app.renderer}/network-error.html`)
  })

  session.protocol.handle(WEBUI_PROTOCOL, (request) => {
    const parsed = new URL(request.url)
    return net.fetch(`file:///${app.renderer}/${parsed.pathname}`)
  })
}
