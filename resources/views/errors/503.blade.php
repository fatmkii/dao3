<!DOCTYPE html>
<html lang="zh_CN">

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="referrer" content="never">
    <link rel="shortcut icon" href="/favicon.ico">
    <title>小火锅</title>
</head>

<body>
    <div class="container">
        小火锅维护中……
        <br>
        {{ config('app.maintenance.message') }}
    </div>
</body>

<style>
    html,
    body {
        height: 100%;
        margin: 0;
    }

    body {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f3fdf3;
    }

    .container {
        box-sizing: border-box;
        width: min(400px, calc(100% - 32px));
        padding: 24px;
        text-align: center;
    }
</style>

</html>