import { GlobalThemeOverrides } from 'naive-ui'

//各个主题的颜色变量在这里！

//naive ui的override
const lightThemeOverrides: GlobalThemeOverrides = {
    "common": {
        "fontFamily": 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Microsoft YaHei"', //加上微软雅黑
        "bodyColor": "rgba(249, 249, 249, 1)",
    },
    "Button": {
        "colorPrimary": "#32BA32FF"
    },
    "Card": {
        "colorPrimary": "#32BA32FF",
        "color": "#fafffa80" //透明背景
    }
}
const sfwThemeOverrides: GlobalThemeOverrides = {
    "common": {
        "fontFamily": 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Microsoft YaHei"', //加上微软雅黑
        "bodyColor": "#f5f6f8",
        "primaryColor": "#333639FF",
    },
    "Button": {
        "colorPrimary": "#333639FF"
    },
    "Card": {
        "colorPrimary": "#32BA32FF",
        "color": "#FFFFFF80" //透明背景
    }
}
const darkThemeOverrides: GlobalThemeOverrides = {
    "common": {
        "fontFamily": 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Microsoft YaHei"', //加上微软雅黑
        "textColor1": "rgba(255, 255, 255, 0.73)",
        "textColor2": "rgba(255, 255, 255, 0.66)",
    },
    "Card": {
        "colorEmbedded": "rgba(44, 44, 50, 1)",
        "color": "rgba(44, 44, 50, 0.5)" //透明背景
    }
}
const greenThemeOverrides: GlobalThemeOverrides = {
    "common": {
        "fontFamily": 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Microsoft YaHei"', //加上微软雅黑
        "bodyColor": "#eefaee",
    },
    "Card": {
        "color": "#fafffa80", //透明背景
        "borderColor": "rgba(233, 245, 234, 1)",
    },
    // "Input": {
    //     "color": "#fbfffbFF",
    //     "colorFocus": "#fbfffbFF"
    // },
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
    sidebarColor: "#90d590",
    postItemBorderColor: "#111111",
    postFooterColor: "#767C82FF",
}
const sfwThemeColors = {
    topBarBackgroudColor: "#FFF",
    sidebarColor: "#aaaaaa",
    postItemBorderColor: "#111111",
    postFooterColor: "#767C82FF",
}
const darkThemeColors = {
    topBarBackgroudColor: "#18181CFF",
    sidebarColor: "#316c58",
    postItemBorderColor: "#FFFFFF17",
    postFooterColor: "#FFFFFF85",
}
const greenThemeColors = {
    topBarBackgroudColor: "#fafffaFF",
    sidebarColor: "#52b051",
    postItemBorderColor: "#5FB878",
    postFooterColor: "#5FB878",
}


export { lightThemeOverrides, sfwThemeOverrides, darkThemeOverrides, greenThemeOverrides, lightThemeColors, sfwThemeColors, darkThemeColors, greenThemeColors }