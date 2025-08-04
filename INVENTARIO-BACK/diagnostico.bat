@echo off
title DIAGNOSTICO - Sistema Inventario
color 0E
echo ========================================
echo      DIAGNOSTICO DEL SISTEMA
echo ========================================
echo.

echo 🔍 Verificando configuracion del sistema...
echo.

REM Verificar directorio
echo 📁 Directorio actual:
echo %CD%
echo.

REM Cambiar al directorio del proyecto
cd /d "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"
echo 📁 Directorio del proyecto:
echo %CD%
echo.

REM Verificar si existe pom.xml
if exist pom.xml (
    echo ✅ Archivo pom.xml encontrado
) else (
    echo ❌ Archivo pom.xml NO encontrado
)
echo.

REM Verificar Java
echo 🔍 Verificando Java...
java -version 2>&1
if errorlevel 1 (
    echo ❌ Java no esta instalado o configurado
) else (
    echo ✅ Java encontrado
)
echo.

REM Verificar Maven
echo 🔍 Verificando Maven...
mvn --version 2>&1
if errorlevel 1 (
    echo ❌ Maven no esta instalado o configurado
    echo 💡 Descarga Maven desde: https://maven.apache.org/download.cgi
) else (
    echo ✅ Maven encontrado
)
echo.

REM Verificar dependencias del proyecto
echo 🔍 Verificando dependencias del proyecto...
mvn dependency:resolve -q
if errorlevel 1 (
    echo ❌ Error al resolver dependencias
) else (
    echo ✅ Dependencias resueltas correctamente
)
echo.

REM Verificar puerto 8080
echo 🔍 Verificando puerto 8080...
netstat -an | find "8080" >nul
if errorlevel 1 (
    echo ✅ Puerto 8080 disponible
) else (
    echo ⚠️ Puerto 8080 puede estar en uso
)
echo.

echo ========================================
echo           RESUMEN DIAGNOSTICO
echo ========================================
echo.
echo Si todo aparece como ✅, el sistema deberia funcionar.
echo Si hay ❌, revisa la instalacion de los componentes faltantes.
echo.
pause
