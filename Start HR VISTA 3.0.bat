@echo off
title HR VISTA 3.0 - Launcher v2
setlocal EnableDelayedExpansion
cd /d "%~dp0"
echo [HR VISTA] Project: %CD%

rem --- Kill any stale/zombie process holding port 3000 ---
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }" >nul 2>&1
timeout /t 2 /nobreak >nul

rem --- First run: install dependencies ---
if not exist "node_modules" (
  echo [HR VISTA] First run - installing dependencies, wait a minute...
  call npm install
)

rem --- Start dev server in its own window ---
echo [HR VISTA] Starting dev server...
start "HR VISTA 3.0 Dev Server" cmd /k "npm run dev"

rem --- Poll until the server actually answers (max ~90s) ---
echo [HR VISTA] Waiting for http://localhost:3000 ...
set /a TRIES=0
:WAITLOOP
curl -s --max-time 3 -o NUL http://localhost:3000
if not errorlevel 1 goto UP
set /a TRIES+=1
if !TRIES! GEQ 30 goto FAILED
timeout /t 3 /nobreak >nul
goto WAITLOOP

:UP
echo [HR VISTA] Server is UP - opening browser.
start "" "http://localhost:3000"
echo [HR VISTA] Done. Close the "HR VISTA 3.0 Dev Server" window to stop the server.
timeout /t 5 /nobreak >nul
exit /b 0

:FAILED
echo [HR VISTA] ERROR: server did not respond in 90 seconds.
echo [HR VISTA] Check the "HR VISTA 3.0 Dev Server" window for error text and send it to me.
pause
exit /b 1
