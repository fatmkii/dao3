
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
        ImgSrc: "https://wmimg.com/i/1547/2025/02/67adef97cf647.png",
    },
    23401: {
        name: "olo不足",
        ImgSrc: "https://wmimg.com/i/1547/2025/02/67adef9811f04.png",
    },
    234011: {
        name: "私密主题",
        ImgSrc: "https://wmimg.com/i/1547/2025/02/67adef97ce810.png",
    },
    23404: {
        name: "板块or主题不存在",
        ImgSrc: "https://wmimg.com/i/1547/2025/02/67adef9818836.png",
    },
    21404: {
        name: "需要饼干",
        ImgSrc: "https://wmimg.com/i/1547/2025/02/67adef97e42d8.png",
    },
}
