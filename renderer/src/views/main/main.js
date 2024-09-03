import 'uno.css'
import 'virtual:svg-icons-register'

import '@/styles/index.scss'
import SvgIcon from '@/components/SvgIcon/index.vue'

import { createApp } from 'vue'

import { setupStore } from './store/index.js'

import App from './app.vue'

async function bootstrap() {
  const app = createApp(App)

  setupStore(app)

  app.component('SvgIcon', SvgIcon)

  app.mount('#app')
}

void bootstrap()
