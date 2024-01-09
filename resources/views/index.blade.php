<!DOCTYPE html>
<html lang="zh_CN">

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="referrer" content="never">
    <link rel="shortcut icon" href="/favicon2.ico">
    <title>小火锅</title>
    @vite('resources/js/app.js')
</head>

<body>
    <div id='app' class='container'>
        <router-view></router-view>
    </div>
</body>


</html>