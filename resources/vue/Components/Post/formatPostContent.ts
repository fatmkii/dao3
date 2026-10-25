export interface PostDisplayOptions {
    noImageMode?: boolean
    noEmojiMode?: boolean
    noCustomEmojiMode?: boolean
    useUrlMode?: boolean
    disableStyles?: boolean
}

export function formatPostContent(content: string, options: PostDisplayOptions = {}): string {
    function imgReplacer(match: string) {//用于屏蔽表情包或者其他图片的回调函数
        if (match.search(/class='emoji[-_]img'/g) != -1) {//旧2.0代码使用下划线，现3.0使用横杠-，这里要匹配两种
            //判断是否表情包
            return options.noEmojiMode ? "" : match

        } else if (match.search(/class='custom[-_]emoji[-_]img'/g) != -1) {//旧2.0代码使用下划线，现3.0使用横杠-，这里要匹配两种
            //判断是否自定义表情包
            return options.noCustomEmojiMode ? "" : match
        } else {
            if (options.noImageMode) {
                //no_image_mode:无图模式
                return match
                    .replace(/src/i, "origin-src")
                    .replace(/<img /i, '<img src="/img_svg.svg" class="img-svg"');
            } else {
                return match;
            }
        }
    }
    let postContent = content.replace(/<img[^>]*>/gi, imgReplacer)
        .replace(/<script/gi, "<**禁止使用script**")
        .replace(/<base/gi, "<**禁止使用base标签**")
        .replace(/\n/g, "<br>")
    if (options.disableStyles) postContent = postContent.replace(/<style/gi, "<**停止解析style")
    if (options.useUrlMode) postContent = linkPostUrls(postContent)

    return postContent
}

export function linkPostUrls(postContent: string): string {
    function urlReplacer(match: string) {
        if (/\.(png|jpe?g|webp|gif)$/i.test(match)) return match
        const href = /^www\./i.test(match) ? 'http://' + match : match
        return `<a href="${href}" target="_blank">${match}</a>`
    }
    const reg = /((https?:\/\/|www\.)[\w\-@:]+(\.[\w\-@:]+)+([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?)/gi
    return postContent.replace(reg, urlReplacer)
}
