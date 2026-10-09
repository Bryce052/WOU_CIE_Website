@echo off
cd /d "%~dp0"
node --version >nul 2>&1
if errorlevel 1 (
  echo Please install Node.js 22 or later from https://nodejs.org and reopen this file.
  pause
  exit /b 1
)
echo Starting website. Open http://localhost:3000 in your browser.
node server.mjs
pause
