
interface forbiddenImg {
    [key: number]: {
        name: string,
        ImgSrc: string,
    };
}

export const forbiddenImg: forbiddenImg = {
    0: {
        name: "空白占位",
        ImgSrc: "",
    },
    23410: {
        name: "已日清",
        ImgSrc: "https://www.freeimg.cn/i/2024/05/14/664358a7a2f38.png",
    },
    23401: {
        name: "olo不足",
        ImgSrc: "https://www.freeimg.cn/i/2024/05/14/664358a7c0196.png",
    },
    234011: {
        name: "私密主题",
        ImgSrc: "https://www.freeimg.cn/i/2024/05/14/664358a793fb1.png",
    },
    23404: {
        name: "板块or主题不存在",
        ImgSrc: "https://www.freeimg.cn/i/2024/05/14/664358a7db594.png",
    },
    21404: {
        name: "需要饼干",
        ImgSrc: "https://www.freeimg.cn/i/2024/05/14/664358a7b1035.png",
    },
}
