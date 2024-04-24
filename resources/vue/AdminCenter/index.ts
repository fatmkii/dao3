import { defineAsyncComponent } from 'vue'

export const TabBanners = defineAsyncComponent(() => import('./TabBanners.vue'))
export const TabGlobal = defineAsyncComponent(() => import('./TabGlobal.vue'))
export const TabMedal = defineAsyncComponent(() => import('./TabMedal.vue'))
export const TabCoin = defineAsyncComponent(() => import('./TabCoin.vue'))
export const AdminCard = defineAsyncComponent(() => import('./AdminCard.vue'))