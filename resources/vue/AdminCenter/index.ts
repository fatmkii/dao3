import { defineAsyncComponent } from 'vue'

export const TabBanners = defineAsyncComponent(() => import('./TabBanners.vue'))
// export const TabBank = defineAsyncComponent(() => import('./TabBank.vue'))
// export const TabChara = defineAsyncComponent(() => import('./TabChara.vue'))
// export const TabCustom = defineAsyncComponent(() => import('./TabCustom.vue'))
// export const TabEmojis = defineAsyncComponent(() => import('./TabEmojis.vue'))
// export const TabIncome = defineAsyncComponent(() => import('./TabIncome.vue'))
// export const TabLevelup = defineAsyncComponent(() => import('./TabLevelup.vue'))
// export const TabMedal = defineAsyncComponent(() => import('./TabMedal.vue'))
// export const TabPassword = defineAsyncComponent(() => import('./TabPassword.vue'))
// export const TabPingbici = defineAsyncComponent(() => import('./TabPingbici.vue'))
export const AdminCard = defineAsyncComponent(() => import('./AdminCard.vue'))