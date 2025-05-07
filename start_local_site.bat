@echo off
title Local Website

:: Создание папки для сайта
mkdir website 2>nul
cd website

:: Создание папок для ресурсов
mkdir css 2>nul
mkdir js 2>nul

:: Создание CSS файла
echo body { > css\style.css
echo     background: #f0f2f5; >> css\style.css
echo     font-family: Arial, sans-serif; >> css\style.css
echo     margin: 0; >> css\style.css
echo     padding: 20px; >> css\style.css
echo } >> css\style.css
echo .container { >> css\style.css
echo     max-width: 800px; >> css\style.css
echo     margin: 0 auto; >> css\style.css
echo     background: white; >> css\style.css
echo     padding: 20px; >> css\style.css
echo     border-radius: 8px; >> css\style.css
echo     box-shadow: 0 2px 4px rgba(0,0,0,0.1); >> css\style.css
echo } >> css\style.css

:: Создание JS файла
echo function init() { > js\main.js
echo     console.log('Site loaded!'); >> js\main.js
echo } >> js\main.js

:: Создание HTML файла
echo ^<!DOCTYPE html^>^
<html^>^
<head^>^
    <title^>Local Website^</title^>^
    <link rel="stylesheet" href="css/style.css"^>^
    <script src="js/main.js"^>^</script^>^
</head^>^
<body onload="init()"^>^
    <div class="container"^>^
        <h1^>Welcome to Local Website!^</h1^>^
        <p^>This is a locally hosted website with styles and scripts.^</p^>^
    ^</div^>^
</body^>^
</html^> > index.html

:: Создание и запуск PowerShell скрипта для веб-сервера
echo $listener = New-Object System.Net.HttpListener > server.ps1
echo $listener.Prefixes.Add('http://localhost:8080/') >> server.ps1
echo $listener.Start() >> server.ps1
echo Write-Host "Server running at http://localhost:8080/" >> server.ps1
echo while ($listener.IsListening) { >> server.ps1
echo     $context = $listener.GetContext() >> server.ps1
echo     $response = $context.Response >> server.ps1
echo     $content = Get-Content -Path "index.html" -Raw >> server.ps1
echo     $buffer = [System.Text.Encoding]::UTF8.GetBytes($content) >> server.ps1
echo     $response.ContentLength64 = $buffer.Length >> server.ps1
echo     $response.OutputStream.Write($buffer, 0, $buffer.Length) >> server.ps1
echo     $response.Close() >> server.ps1
echo } >> server.ps1

:: Запуск сервера в PowerShell
start powershell -NoExit -ExecutionPolicy Bypass -File server.ps1

:: Ждем 2 секунды и открываем браузер
timeout /t 2 >nul
start http://localhost:8080
echo Server is running! To stop, close this window and the PowerShell window.
pause
