@echo off
title INVENTARIO BACKEND - Spring Boot
color 0A
echo ========================================
echo    INICIANDO BACKEND - INVENTARIO
echo ========================================
echo.
echo 🚀 Ejecutando aplicacion Spring Boot...
echo 📍 Puerto: 8080
echo 🌐 URL: http://localhost:8080
echo 👤 Usuario: Coordinador
echo 🔑 Contraseña: JimmyVelandia
echo.
echo ⏳ Cambiando al directorio del proyecto...

REM Cambiar al directorio del proyecto
cd /d "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"

echo ✅ Directorio actual: %CD%
echo.
echo ⏳ Verificando que Maven este disponible...

REM Verificar si Maven está disponible
mvn --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Maven no esta instalado o no esta en el PATH
    echo 💡 Instala Maven desde: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo ✅ Maven encontrado
echo.
echo 🚀 Iniciando Spring Boot...
echo.

REM Ejecutar Spring Boot
call mvn spring-boot:run

echo.
echo 🔄 Aplicacion finalizada
pause
