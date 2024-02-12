import { defineStore } from 'pinia'
import { darkTheme, GlobalThemeOverrides, type GlobalTheme } from 'naive-ui'
import { ref, computed } from 'vue'
import { lightThemeOverrides, darkThemeOverrides, greenThemeOverrides, lightThemeColors, darkThemeColors, greenThemeColors } from '@/data/theme'

export const usethemeStore = defineStore('themeStore', () => {
    const themeClass = ref<GlobalTheme | null>(null)
    const themeName = ref<string | null>(null) //用来标记当前状态的

    function themeChange(name: string) {
        themeName.value = name
        if (name === 'light') {
            themeClass.value = null
        } else if (name === 'dark') {
            themeClass.value = darkTheme
        } else if (name === 'green') {
            //绿色主题基于浅色主题改
            themeClass.value = null
        } else {
            themeClass.value = null
        }
    }

    const themeOverrideClass = computed<GlobalThemeOverrides>(() => {
        //根据主题名称themeName返回相应的overrides class（在'@/data/theme')
        if (themeName.value === 'light') {
            return lightThemeOverrides
        }
        if (themeName.value === 'dark') {
            return darkThemeOverrides
        }
        if (themeName.value === 'green') {
            return greenThemeOverrides
        }
        return lightThemeOverrides
    })

    const buttonThemeAttr = computed(() => {
        //根据主题名称themeName返回相应的按钮attribute 
        //也就是白色和黑色主题都使用低饱和度的secondary按钮
        if (themeName.value === 'light') {
            return { strong: true, secondary: true }
        }
        if (themeName.value === 'dark') {
            return { strong: true, secondary: true }
        }
        if (themeName.value === 'green') {
            return { strong: false, secondary: false }
        }
        return { strong: true, secondary: true }
    })


    const themeColor = computed(() => {
        //一些自定义的颜色
        if (themeName.value === 'light') { return lightThemeColors }
        if (themeName.value === 'dark') { return darkThemeColors }
        if (themeName.value === 'green') { return greenThemeColors }
        return lightThemeColors
    })


    return { themeClass, themeOverrideClass, themeChange, buttonThemeAttr, themeColor }
})

