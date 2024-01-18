import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('commonStore', () => {

    const unauthModalShow = ref<boolean>(false)
    const requestErrorCode = ref<number>(0)

    return { unauthModalShow, requestErrorCode }

})

