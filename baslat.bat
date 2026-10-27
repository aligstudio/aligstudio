@echo off
chcp 65001 >nul
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo   ALIG Studio - Gelistirme Sunucusu Baslatiliyor...
echo   Ana Sayfa   : http://localhost:3000
echo   Admin Panel : http://localhost:3000/studio-7f3k9
echo   Varsayilan Sifre: aligstudio
echo ========================================================
call "C:\Program Files\nodejs\npm.cmd" run dev
pause
