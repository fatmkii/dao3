import { defineStore } from 'pinia'
import { darkTheme, GlobalThemeOverrides, type GlobalTheme } from 'naive-ui'
import { ref, computed } from 'vue'
import { lightThemeOverrides, sfwThemeOverrides, darkThemeOverrides, greenThemeOverrides, lightThemeColors, sfwThemeColors, darkThemeColors, greenThemeColors } from '@/data/theme'
import { useStorage } from '@vueuse/core'

export const useThemeStore = defineStore('themeStore', () => {
    const themeName = useStorage<string>('theme', 'green') //用来标记当前状态的

    function themeChange(name: string) {
        themeName.value = name
    }

    const themeClass = computed(() => {
        const themeNameMap: { [key: string]: any } = {
            'light': null,
            'sfw': null, //魔芋锅主题在浅色主题上修改
            'dark': darkTheme,
            'green': null //绿色主题基于浅色主题上修改
        };
        return themeNameMap[themeName.value] || null;
    })

    const themeOverrideClass = computed<GlobalThemeOverrides>(() => {
        //根据主题名称themeName返回相应的overrides class（数据在'@/data/theme')
        const themeClassMap: { [key: string]: any } = {
            'light': lightThemeOverrides,
            'sfw': sfwThemeOverrides,
            'dark': darkThemeOverrides,
            'green': greenThemeOverrides //绿色主题基于浅色主题改
        };

        return themeClassMap[themeName.value] || lightThemeOverrides
    })

    const buttonThemeAttr = computed(() => {
        //根据主题名称themeName返回相应的按钮attribute 
        //也就是白色和黑色主题都使用低饱和度的secondary按钮
        const buttonThemeAttrMap: { [key: string]: any } = {
            'light': { strong: true, secondary: true, tertiary: false },
            'sfw': { strong: true, secondary: false, tertiary: true },
            'dark': { strong: true, secondary: true, tertiary: false },
            'green': { strong: false, secondary: false, tertiary: false }
        };
        return buttonThemeAttrMap[themeName.value] || { strong: true, secondary: true, tertiary: false }
    })


    const themeColor = computed(() => {
        //一些自定义的颜色
        const themeColorsMap: { [key: string]: any } = {
            'light': lightThemeColors,
            'sfw': sfwThemeColors,
            'dart': darkThemeColors,
            'green': greenThemeColors,
        }
        return themeColorsMap[themeName.value] || lightThemeColors
    })


    return { themeClass, themeOverrideClass, themeChange, buttonThemeAttr, themeColor }
})

