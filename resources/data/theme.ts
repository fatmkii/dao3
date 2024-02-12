import { GlobalThemeOverrides } from 'naive-ui'

//各个主题的颜色变量在这里！

//naive ui的override
const lightThemeOverrides: GlobalThemeOverrides = {
    common: {
        // cardColor: "rgba(249, 249, 249, 1)",
        "bodyColor": "rgba(249, 249, 249, 1)"
    },
}
const darkThemeOverrides: GlobalThemeOverrides = {
    //暂时为空
}
const greenThemeOverrides: GlobalThemeOverrides = {
    //暂时为空
}

//自己用的各个颜色
const lightThemeColors = {
}
const darkThemeColors = {
}
const greenThemeColors = {
}


export { lightThemeOverrides, darkThemeOverrides, greenThemeOverrides, lightThemeColors, darkThemeColors, greenThemeColors }