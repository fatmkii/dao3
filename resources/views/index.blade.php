<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="referrer" content="never">
    <link rel="shortcut icon" href="/favicon.ico">
    <title>小火锅</title>
    @vite('resources/js/app.js')
</head>

<body>
    <div id='app' class="root-container">
        <app></app>
    </div>
</body>