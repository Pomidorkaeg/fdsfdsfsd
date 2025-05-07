:: filepath: c:\Users\WORKING\Desktop\popl\run_localhost.bat
@echo off
title Настройка и запуск локального сайта

:: Проверка прав администратора
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Запустите этот файл от имени администратора!
    pause
    exit /b
)

:: Установка Python (если отсутствует)
echo Проверка наличия Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Установка Python...
    powershell -Command "Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.11.5/python-3.11.5-amd64.exe -OutFile python_installer.exe"
    start /wait python_installer.exe /quiet InstallAllUsers=1 PrependPath=1
    del python_installer.exe
)

:: Создание папки для сайта
echo Настройка локального сайта...
mkdir site >nul 2>&1
cd site
echo <html><body><h1>Добро пожаловать на локальный сайт!</h1></body></html> > index.html

:: Запуск локального сервера
echo Запуск локального хостинга на http://localhost:8080...
start python -m http.server 8080

:: Открытие сайта в браузере
timeout /t 3 >nul
start http://localhost:8080
pause