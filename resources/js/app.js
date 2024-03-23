// import '@/js/bootstrap';    项目使用alova代替axios，这里没有使用bootstrap.js的默认配置
import '@/css/app.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/routes/routes.js';
import root_component from '@/vue/App.vue'

const pinia = createPinia()
const app = createApp({})

app.component('app', root_component)

app.use(router)
app.use(pinia)
app.mount('#app')
