import { GlobalThemeOverrides } from 'naive-ui'

//各个主题的颜色变量在这里！

//naive ui的override
const lightThemeOverrides: GlobalThemeOverrides = {
    common: {
        bodyColor: "rgba(249, 249, 249, 1)"
    },
}
const darkThemeOverrides: GlobalThemeOverrides = {
    common: {
        textColor1: "rgba(255, 255, 255, 0.73)",
        textColor2: "rgba(255, 255, 255, 0.66)",
    },
    Card: {
        "colorEmbedded": "rgba(44, 44, 50, 1)"
    }
}
const greenThemeOverrides: GlobalThemeOverrides = {
    "common": {
        "bodyColor": "#f3fdf3FF",
    },
    "Card": {
        "color": "#fafffaFF",
        "borderColor": "rgba(233, 245, 234, 1)",
    },
    "Input": {
        "color": "#fbfffbFF",
        "colorFocus": "#fbfffbFF"
    },
    "Button": {
        "colorPrimary": "#52b051FF",
        "colorHoverPrimary": "#3ba251FF",
        "color": "#ffffffFF",
        "colorHover": "#ffffffFF",
        "colorPressed": "#ffffffFF",
        "colorFocus": "#ffffffFF",
        "colorDisabled": "#ffffffFF",
        "colorPressedPrimary": "#3a9958FF",
        "borderPressedPrimary": "0px",
        "borderFocusPrimary": "0px",
        "borderDisabledPrimary": "0px",
        "borderHoverPrimary": "0px",
        "borderPrimary": "0px",
        "colorSecondary": "rgba(46, 51, 56, .05)",
        "colorTertiary": "rgba(46, 51, 56, .05)",
        "textColorTertiary": "rgb(118, 124, 130)",
    }
}

//自己用的各个颜色
const lightThemeColors = {
    topBarBackgroudColor: "#FFF",
}
const darkThemeColors = {
    topBarBackgroudColor: "#18181CFF",
}
const greenThemeColors = {
    topBarBackgroudColor: "#fafffaFF",
}


export { lightThemeOverrides, darkThemeOverrides, greenThemeOverrides, lightThemeColors, darkThemeColors, greenThemeColors }