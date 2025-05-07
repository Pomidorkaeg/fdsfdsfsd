@echo off
echo Starting website setup...

REM Initial port setting
set PORT=8080

REM Check if the port is already in use
:CHECK_PORT
netstat -ano | findstr :%PORT% >nul
if %errorlevel% equ 0 (
    echo Port %PORT% is already in use.
    if %PORT% equ 8080 (
        echo Trying port 3000...
        set PORT=3000
        goto CHECK_PORT
    ) else if %PORT% equ 3000 (
        echo Trying port 5000...
        set PORT=5000
        goto CHECK_PORT
    ) else (
        echo All fallback ports are in use. Please free up a port and try again.
        pause
        exit
    )
)

REM Test network connectivity
ping -n 1 127.0.0.1 >nul
if %errorlevel% neq 0 (
    echo Local network interface is not responding!
    echo Please check your network adapter settings.
    pause
    exit
)

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed! Please install Node.js first.
    pause
    exit
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules\ (
    echo Installing dependencies...
    call npm install
)

REM Build project if needed
if exist package.json (
    findstr "build" package.json >nul
    if %errorlevel% equ 0 (
        echo Building project...
        call npm run build
    )
)

REM Start server with better error handling
echo Starting web server on port %PORT%...
start http://localhost:%PORT%
call npm start
if %errorlevel% neq 0 (
    echo Failed to start the server using npm. Please check for errors in your application.
    echo Possible reasons:
    echo - Syntax errors in your code
    echo - Missing dependencies.
    echo - Issues with the npm configuration.
    echo.
    echo To debug:
    echo - Run "npm start" manually and check for errors.
    echo - Check the npm logs for details.
    pause
    exit
)

REM Check if the server process is running
timeout /t 5 >nul
netstat -ano | findstr :%PORT% >nul
if %errorlevel% neq 0 (
    echo Server failed to start on port %PORT%.
    echo Possible reasons:
    echo - Another server is running on the same port.
    echo - Firewall is blocking the connection.
    echo - The application encountered an error.
    echo.
    echo To debug:
    echo - Run "npm start" manually and check for errors.
    echo - Temporarily disable the firewall and retry.
    echo - Ensure no other application is using the port.
    pause
    exit
)

echo.
echo Website is running at: http://localhost:%PORT%
echo.
echo Press any key to close this window...
pause > nul
