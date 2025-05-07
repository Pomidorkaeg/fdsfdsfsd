@echo off
echo Installing required components...

:: Install Chocolatey
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"
SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

:: Install Node.js
choco install nodejs -y
refreshenv

:: Create project directory
mkdir website
cd website

:: Initialize Node project and install Express
call npm init -y
call npm install express

:: Create simple web server
echo const express = require('express');> index.js
echo const app = express();>> index.js
echo const port = 3000;>> index.js
echo app.get('/', (req, res) =^> {>> index.js
echo     res.send('Hello World! This website is running on a fresh PC!');>> index.js
echo });>> index.js
echo app.listen(port, () =^> {>> index.js
echo     console.log(`Server running at http://localhost:${port}`);>> index.js
echo });>> index.js

:: Start the server
echo.
echo ========================================
echo Starting web server...
echo The website will be available at: http://localhost:3000
echo ========================================
echo Press Ctrl+C to stop the server
echo.

node index.js

echo.
echo Server stopped. Press any key to exit...
pause >nul
