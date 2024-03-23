//将字符串复制到剪贴板
function copyToClipboard(text: string) { //复制到剪贴板
    if (!navigator.clipboard) {
        // 如果浏览器不支持 Clipboard API，则降级为使用 document.execCommand 方法
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return;
    }
    navigator.clipboard.writeText(text)
}

export default copyToClipboard