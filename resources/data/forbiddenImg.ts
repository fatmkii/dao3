
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
        ImgSrc: "https://oss.cpttmm.com/xhg_other/notice_2.png",
    },
    23401: {
        name: "olo不足",
        ImgSrc: "https://oss.cpttmm.com/xhg_other/notice_3.png",
    },
    234011: {
        name: "私密主题",
        ImgSrc: "https://oss.cpttmm.com/xhg_other/notice_1.png",
    },
    23404: {
        name: "板块or主题不存在",
        ImgSrc: "https://oss.cpttmm.com/xhg_other/notice_404.png",
    },
    21404: {
        name: "需要饼干",
        ImgSrc: "https://oss.cpttmm.com/xhg_other/notice_4.png",
    },
}
