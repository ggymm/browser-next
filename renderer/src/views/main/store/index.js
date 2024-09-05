import { createPinia } from 'pinia'

export function setupStore(app) {
  app.use(createPinia())
}

export * from './modules/app.js'
export * from './modules/tabs.js'
