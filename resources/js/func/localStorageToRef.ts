import { ref, watch } from 'vue'

//onMount时读取相应的LocalStorage，赋值给Ref变量
//Ref变量变动时，写入LocalStorage
function useLocalStorageToRef<T = string>(key: string, defaultValue?: T) {

    const value = ref<T>()
    let valueRaw: string | null = null

    valueRaw = localStorage.getItem(key)
    if (valueRaw) {
        value.value = JSON.parse(valueRaw)
    } else if (defaultValue !== undefined) {
        value.value = defaultValue
    } else {
        value.value = undefined
    }

    watch(value, (newValue) => {
        localStorage.setItem(key, JSON.stringify(newValue))
    })

    return value
}

export { useLocalStorageToRef }