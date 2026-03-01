@echo off
title Abrir App - Metele Gol al Cancer
echo ==========================================
echo   ABRIENDO TU APLICACION...
echo ==========================================
echo.

:: Intentar limpiar el puerto 3000
echo Paso 1: Limpiando conexiones antiguas...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul
echo Listo.
echo.

:: Buscar la IP local del equipo
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4.*[0-9]"') do set IP=%%a
set IP=%IP: =%

echo Paso 2: DIRECCION PARA TU CELULAR
echo ------------------------------------------
echo Escribe esto en el navegador de tu celular:
echo.
echo http://%IP%:3000
echo.
echo (Nota: Debes estar en el mismo Wi-Fi del PC)
echo ------------------------------------------
echo.

echo Paso 3: Encendiendo en el Computador...
echo (Se abrira en: http://localhost:3000)
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ==========================================
    echo   UPS! ALGO HA FALLADO AL ENCENDER
    echo ==========================================
    pause
)
pause
