import { onEvent, sendEvent } from './event'

export const on = (callback) => {
  onEvent('main:window:on-maximize', callback(true))
  onEvent('main:window:on-unmaximize', callback(false))
}

export const close = () => {
  sendEvent('renderer:window:close')
}

export const restore = () => {
  sendEvent('renderer:window:restore')
}

export const minimize = () => {
  sendEvent('renderer:window:minimize')
}

export const maximize = () => {
  sendEvent('renderer:window:maximize')
}
