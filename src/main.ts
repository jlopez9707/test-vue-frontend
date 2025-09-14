import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import { i18n } from './i18n'
import './assets/tailwind.css' 

createApp(App).use(Quasar, quasarUserOptions).use(i18n).mount('#app')
