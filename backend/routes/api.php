<?php

use App\Http\Controllers\Api\CarController;
use Illuminate\Support\Facades\Route;

Route::get('/cars', [CarController::class, 'index']);
