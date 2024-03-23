import { ref, watch, type Ref } from 'vue'

//onMount时读取相应的LocalStorage，赋值给Ref变量
//Ref变量变动时，写入LocalStorage
function useLocalStorageToRef<T = string>(key: string, defaultValue: T) {

    const value = ref<T>(defaultValue)
    let valueRaw: string | null = null

    valueRaw = localStorage.getItem(key)
    if (valueRaw) {
        try {
            value.value = JSON.parse(valueRaw)
        } catch {
            //有些旧的localStorage是非JSON格式值，例如theme = hdao（非"hdao"）
            //此时直接不赋值，让value保持defaultValue即可s
        }
    }

    watch(value, (newValue) => {
        localStorage.setItem(key, JSON.stringify(newValue))
    })

    return value
}

export { useLocalStorageToRef }