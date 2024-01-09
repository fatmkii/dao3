import './bootstrap';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './routes';

const pinia = createPinia()
const app = createApp({})
app.use(router)
app.use(pinia)
app.mount('#app')


