@echo off
title DAYS Yoga Website
echo.
echo ================================
echo  DAYS YOGA WEBSITE STARTING...
echo ================================
echo.

cd /d "C:\Users\AYUSH\Desktop\ayuswweb"

echo Website will run on: http://localhost:5173
echo Press CTRL+C to stop
echo.

"C:\Program Files\nodejs\npm.cmd" run dev

pause
