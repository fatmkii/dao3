import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Homepage', component: () => import('@/vue/Home/Home.vue') },
    { path: '/:pathMatch(.*)*', name: 'Page404', component: () => import('@/vue/errors/404.vue') },
    {
        path: '/forum/:forum_id/:page?',
        name: 'forum',
        // props: route => ({
        //     forum_id: parseInt(route.params.forum_id),
        //     page: parseInt(isNaN(route.params.page) ? 1 : route.params.page),
        // }),
        component: null,//TODO
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})


export default router