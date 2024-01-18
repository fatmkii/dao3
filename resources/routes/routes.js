import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Homepage', component: () => import('@/vue/Home.vue') },
    { path: '/:pathMatch(.*)*', name: 'Page404', component: () => import('@/vue/errors/404.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})


export default router