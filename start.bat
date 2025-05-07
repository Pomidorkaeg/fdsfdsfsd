@echo off
title Tournament Tables Hub Launcher

:: Проверяем наличие Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js не установлен. Установка...
    :: Скачиваем установщик Node.js
    curl -o nodejs.msi https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi
    :: Устанавливаем Node.js
    msiexec /i nodejs.msi /qn
    :: Ждем завершения установки
    timeout /t 10
    del nodejs.msi
)

:: Проверяем наличие папки node_modules
if not exist "node_modules" (
    echo Установка зависимостей...
    call npm install
)

:: Запускаем сайт
echo Запуск сайта...
npm start

:: Держим окно открытым
pause
