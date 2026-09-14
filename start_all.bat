@echo off
title CyberQuant-AI Platform Launcher
echo ========================================================
echo   Launching CyberQuant-AI Full Platform
echo   - Backend:  http://127.0.0.1:8000
echo   - Frontend: http://localhost:5173
echo   - Swagger:  http://127.0.0.1:8000/docs
echo ========================================================

start "CyberQuant Backend" cmd /c "start_backend.bat"
timeout /t 3 /nobreak >nul
start "CyberQuant Frontend" cmd /c "start_frontend.bat"

echo Platform started in separate windows!
echo Open http://localhost:5173 in your browser.
pause
