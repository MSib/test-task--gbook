import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import './style.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import { CustomAura } from './theme'

const pinia = createPinia()
createApp(App)
  .use(router)
  .use(pinia)
  .use(PrimeVue, {
    theme: {
      preset: CustomAura,
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'base, primevue',
        },
      },
    },
  })
  .mount('#app')
