import { defineStore } from 'pinia'
import { darkTheme, GlobalThemeOverrides, type GlobalTheme } from 'naive-ui'
import { ref, computed } from 'vue'
import { lightThemeOverrides, darkThemeOverrides, greenThemeOverrides, lightThemeColors, darkThemeColors, greenThemeColors } from '@/data/theme'
import { useStorage } from '@vueuse/core'

export const useThemeStore = defineStore('themeStore', () => {
    const themeName = useStorage<string>('theme', 'green') //用来标记当前状态的

    function themeChange(name: string) {
        themeName.value = name
    }

    const themeClass = computed(() => {
        const themeNameMap: { [key: string]: any } = {
            'light': null,
            'dark': darkTheme,
            'green': null //绿色主题基于浅色主题上修改
        };
        return themeNameMap[themeName.value] || null;
    })

    const themeOverrideClass = computed<GlobalThemeOverrides>(() => {
        //根据主题名称themeName返回相应的overrides class（数据在'@/data/theme')
        const themeClassMap: { [key: string]: any } = {
            'light': lightThemeOverrides,
            'dark': darkThemeOverrides,
            'green': greenThemeOverrides //绿色主题基于浅色主题改
        };

        return themeClassMap[themeName.value] || lightThemeOverrides
    })

    const buttonThemeAttr = computed(() => {
        //根据主题名称themeName返回相应的按钮attribute 
        //也就是白色和黑色主题都使用低饱和度的secondary按钮
        const buttonThemeAttrMap: { [key: string]: any } = {
            'light': { strong: true, secondary: true },
            'dark': { strong: true, secondary: true },
            'green': { strong: false, secondary: false }
        };
        return buttonThemeAttrMap[themeName.value] || { strong: true, secondary: true }
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

