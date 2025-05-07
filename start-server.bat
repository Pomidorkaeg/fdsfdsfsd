@echo off
echo Checking system requirements...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Installing Node.js...
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi' -OutFile 'node_installer.msi'}"
    start /wait msiexec /i node_installer.msi /quiet
    del node_installer.msi
    echo Node.js installed successfully.
)

REM Check if npm packages are installed
cd /d "%~dp0"
if not exist "node_modules" (
    echo Installing project dependencies...
    call npm install
)

echo Starting local server...
call npm start
pause
