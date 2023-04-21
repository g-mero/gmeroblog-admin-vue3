import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import './assets/base.css'
import { getServerConfig } from './utils/config'
import { httpInit } from './api/http'

const app = createApp(App)

getServerConfig(app).then(async () => {
  httpInit()
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)

  app.use(router)
  await router.isReady()

  app.mount('#app')
})
