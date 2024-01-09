import { createRouter, createWebHistory } from 'vue-router'
import Test from '../vue/test.vue'

const routes = [
    { path: '/', component: Test },
]

const router = createRouter({
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})


export default router