@echo off
echo Installing required launcher backend files...
call npm install
echo.
echo Starting backend server...
call node server.js
pause
