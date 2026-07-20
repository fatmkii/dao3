<?php

use Illuminate\Support\Facades\Route;

Route::view('/privacy/android', 'privacy.android')->name('privacy.android');

Route::get('/{path}', function () {
    return view('index');
})->where('path','.*');
