import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Homepage', component: () => import('@/vue/Home/Home.vue') },
    { path: '/:pathMatch(.*)*', name: 'Page404', component: () => import('@/vue/errors/404.vue') },
    {
        path: '/forum/:forumId/:page?',
        name: 'forum',
        props: (route) => ({
            forumId: parseInt(route.params.forumId),
            page: route.params.page ? parseInt(route.params.page) : 1,
            search: route.query.search,
            delay: route.query.delay === 'true' ? true : false
        }),
        component: () => import('@/vue/Forum/ForumPage.vue')
    },
    {
        path: '/thread/:threadId/:page?',
        name: 'thread',
        props: (route) => ({
            threadId: parseInt(route.params.threadId),
            page: route.params.page ? parseInt(route.params.page) : 1,
        }),
        component: () => import('@/vue/Thread/ThreadPage.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else if (to.hash) {
            return { el: to.hash }
        } else {
            return { top: 0 }
        }
    },
})


export default router