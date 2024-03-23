import * as CryptoJS from 'crypto-js'

function bin2hex(s: string) {
    var i,
        l,
        o = "",
        n;

    s += "";
    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i).toString(16);
        o += n.length < 2 ? "0" + n : n;
    }
    return o;
}

function getCanvasFp(domain: string) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var txt = domain;
    ctx!.textBaseline = "top";
    ctx!.font = "14px 'Arial'";
    ctx!.textBaseline = "alphabetic";
    ctx!.fillStyle = "#f60";
    ctx!.fillRect(125, 1, 62, 20);
    ctx!.fillStyle = "#069";
    ctx!.fillText(txt, 2, 15);
    ctx!.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx!.fillText(txt, 4, 17);

    var b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
    // window.atob 用于解码使用 base-64 编码的字符串
    var bin = atob(b64);
    var crc = bin2hex(bin.slice(-16, -12));
    return crc;
}

function getUUID() {
    const key = "XiaoHuoGuoCpttmm"; // 密钥, AES-128 需 16 字符, AES-256 需要32个字符,
    const iv = "abcdef0123456789"; // 初始向量 initial vector 16 个字符

    const key_enc = CryptoJS.enc.Utf8.parse(key);
    const iv_enc = CryptoJS.enc.Utf8.parse(iv);

    var options = {
        iv: iv_enc,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    };

    const CRC = getCanvasFp("BrowserLeaks,com <canvas> 1.0");
    const UA = CryptoJS.MD5(navigator.userAgent).toString().substr(0, 8);
    const encrypted = CryptoJS.AES.encrypt(
        "XiaoHuoGuo" + CRC + UA,
        key_enc,
        options
    ).toString();
    return encrypted;
}

export { getUUID } 