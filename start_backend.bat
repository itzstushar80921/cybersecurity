@echo off
title CyberQuant-AI Backend (FastAPI)
echo ========================================================
echo   Starting CyberQuant-AI Quantitative Risk Engine
echo   API Docs: http://127.0.0.1:8000/docs
echo ========================================================
cd /d "%~dp0\backend"
"..\venv\Scripts\python.exe" run.py
pause
