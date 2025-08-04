@echo off
title INVENTARIO - Maven Wrapper
color 0A
echo ========================================
echo   INICIANDO CON MAVEN WRAPPER
echo ========================================
echo.

REM Cambiar al directorio del proyecto
cd /d "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"
echo 📍 Directorio: %CD%
echo.

echo 🚀 Usando Maven Wrapper (mvnw.cmd)...
echo 🌐 URL: http://localhost:8080/
echo 🎯 Acceso directo (sin login requerido)
echo � Vistas disponibles:
echo    - http://localhost:8080/hello
echo    - http://localhost:8080/inventario
echo    - http://localhost:8080/api/articulos
echo.

REM Usar el wrapper de Maven incluido en el proyecto
call mvnw.cmd spring-boot:run

echo.
echo 🔄 Aplicacion finalizada
pause
