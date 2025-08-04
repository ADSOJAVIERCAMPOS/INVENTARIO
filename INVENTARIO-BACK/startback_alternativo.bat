@echo off
title INVENTARIO BACKEND - Alternativo
color 0B
echo ========================================
echo   INICIANDO BACKEND - METODO DIRECTO
echo ========================================
echo.

REM Cambiar al directorio del proyecto
cd /d "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"
echo 📍 Directorio: %CD%
echo.

echo 🔨 Compilando proyecto...
call mvn clean compile -q

if errorlevel 1 (
    echo ❌ Error en la compilacion
    pause
    exit /b 1
)

echo ✅ Compilacion exitosa
echo.
echo 🚀 Ejecutando aplicacion...
echo 🌐 URL: http://localhost:8080
echo 👤 Usuario: Coordinador / JimmyVelandia
echo.

REM Ejecutar la aplicación
call mvn exec:java -Dexec.mainClass="INVENTARIO.demo.DemoApplication" -Dexec.classpathScope=runtime

pause
