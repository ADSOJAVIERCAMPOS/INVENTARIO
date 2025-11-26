@echo off
echo ========================================
echo   PRUEBA SISTEMA DE NOTIFICACIONES
echo ========================================
echo.
echo 📧 Configurado para: jc2583@gmail.com
echo 🔑 Contraseña: Configurada (sbxi ioio vdrq tkhj)
echo.

echo 🔍 Verificando Java...
java -version
if %errorlevel% neq 0 (
    echo ❌ Java no encontrado. 
    echo 📋 Instala Java 21 desde: https://adoptium.net/temurin/releases/?version=21
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Java encontrado. Iniciando aplicación...
echo.

echo 🔧 Compilando...
call mvnw.cmd clean compile -q
if %errorlevel% neq 0 (
    echo ❌ Error compilando
    pause
    exit /b 1
)

echo ✅ Compilado. Iniciando servidor...
echo ⏳ Espera 30-60 segundos...
echo.

echo 🚀 Iniciando aplicación Spring Boot...
call mvnw.cmd spring-boot:run