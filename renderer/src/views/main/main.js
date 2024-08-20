import 'uno.css'
import 'virtual:svg-icons-register'

import './styles/index.scss'
import { setupStore } from './store/index.js'

import { createApp } from 'vue'

import App from './app.vue'

async function bootstrap() {
  const app = createApp(App)

  setupStore(app)

  app.mount('#app')
}

void bootstrap()
