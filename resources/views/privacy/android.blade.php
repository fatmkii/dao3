<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>小火锅 Android 隐私说明</title>
    <style>
        :root {
            color-scheme: light;
            --ink: #351c18;
            --muted: #725f57;
            --paper: #fffaf2;
            --broth: #9d3529;
            --biscuit: #f2d3a2;
            --line: rgba(53, 28, 24, .16);
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            color: var(--ink);
            background:
                radial-gradient(circle at 12% 8%, rgba(242, 211, 162, .68), transparent 28rem),
                linear-gradient(135deg, #fffdf8, #f8eee2);
            font-family: "Noto Serif SC", "Songti SC", serif;
            line-height: 1.78;
        }
        main {
            width: min(760px, calc(100% - 32px));
            margin: 48px auto;
            padding: clamp(28px, 6vw, 64px);
            background: rgba(255, 250, 242, .92);
            border: 1px solid var(--line);
            border-radius: 28px 8px 28px 8px;
            box-shadow: 0 28px 80px rgba(53, 28, 24, .12);
        }
        header { border-bottom: 2px solid var(--broth); padding-bottom: 24px; }
        .eyebrow { color: var(--broth); font-weight: 700; letter-spacing: .18em; }
        h1 { margin: 8px 0 4px; font-size: clamp(2rem, 7vw, 3.6rem); line-height: 1.08; }
        h2 { margin-top: 40px; font-size: 1.32rem; }
        p, li { color: var(--muted); }
        strong { color: var(--ink); }
        code { color: var(--broth); overflow-wrap: anywhere; }
        .note { padding: 18px 20px; background: rgba(242, 211, 162, .34); border-left: 4px solid var(--broth); }
        footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--line); color: var(--muted); }
        a { color: var(--broth); text-underline-offset: 4px; }
        @media (max-width: 520px) { main { margin: 16px auto; border-radius: 20px 6px; } }
    </style>
</head>
<body>
<main>
    <header>
        <div class="eyebrow">ANDROID · PRIVACY</div>
        <h1>少收集，讲清楚。</h1>
        <p>本说明适用于 application ID 为 <code>com.cpttmm.app</code> 的小火锅 Android 应用。</p>
    </header>

    <h2>我们使用哪些设备信息</h2>
    <p>仅在你主动领取新饼干时，应用读取 Android 提供的 SSAID（<code>Settings.Secure.ANDROID_ID</code>）。应用先在设备上计算带有应用专用前缀的 SHA-256 摘要；服务器再次使用独立密钥计算 HMAC-SHA256，数据库<strong>只保存最终设备键</strong>。</p>
    <p class="note">原始 SSAID、客户端摘要和服务端 HMAC 密钥不会写入数据库或诊断日志。</p>

    <h2>使用目的</h2>
    <ul>
        <li>限制同一 Android 应用签名与设备范围累计领取最多 5 个饼干；</li>
        <li>防止普通卸载重装绕过领取限制；</li>
        <li>不用于广告、跨应用追踪、用户画像或设备真实性证明。</li>
    </ul>
    <p>应用不读取 IMEI、硬件序列号、MAC 地址或广告 ID，也不会把 Android 设备桶与网页版 Canvas 注册桶关联。</p>

    <h2>保存期限与删除</h2>
    <p>最终设备键、累计领取次数、封禁状态及时间戳，在 Android 领取防滥用功能运行期间保留，以维持累计次数限制。服务停止该功能、记录不再具备安全用途，或依法应删除时，我们会删除相应记录。删除设备桶会影响后续防滥用判断，相关请求需通过站点现有管理员联络渠道核验。</p>

    <h2>保存在手机上的数据</h2>
    <p>应用使用 Room 保存账号名称、随机 Profile ID、标签路径和滚动位置；access/refresh token 使用 Android Keystore 的 AES-256-GCM 密钥加密。应用不保存密码，且明确关闭 Android 自动备份。移除账号时会立即清除本地工作区，并在联网后撤销服务端移动会话。</p>

    <h2>网络与网页内容</h2>
    <p>应用仅把原生桥开放给 <code>https://cpttmm.com</code> 与 <code>https://cpttmm.love</code>。其他域名交给系统浏览器，不获得原生桥访问权。应用禁止明文 HTTP、混合内容和 WebView 调试。</p>

    <footer>
        <p>生效日期：2026 年 7 月 19 日</p>
        <a href="/">返回小火锅</a>
    </footer>
</main>
</body>
</html>
