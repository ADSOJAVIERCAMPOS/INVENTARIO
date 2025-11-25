@echo off

title INVENTARIO BACKEND - Spring Boot
color 0A
echo ========================================
echo    INICIANDO BACKEND - INVENTARIO
echo ========================================
echo.

REM Cambiar al directorio del proyecto
cd /d "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"

REM Iniciar Spring Boot
start /B mvnw.cmd spring-boot:run

REM Esperar unos segundos para que el servidor inicie
timeout /t 5 >nul

REM Abrir Chrome en la URL del backend
start chrome http://localhost:8080

echo Aplicación iniciada y navegador abierto.
pause
