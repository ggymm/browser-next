import { createApp } from 'vue'

import app from './app.vue'

async function bootstrap() {
  const vueApp = createApp(app)

  vueApp.mount('#app')
}

void bootstrap()
