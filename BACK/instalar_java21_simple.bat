@echo off
echo ========================================
echo   INSTALADOR JAVA 21 - INVENTARIO ADSO  
echo ========================================
echo.

echo 🔍 Verificando estado actual...
echo JAVA_HOME: %JAVA_HOME%
echo.

echo 🧪 Probando Java...
java -version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Java funcionando
    goto test_project
) else (
    echo ❌ Java no funciona. Instalando...
)

echo.
echo 📥 Instalando Microsoft OpenJDK 21...
echo Por favor espera...

winget install Microsoft.OpenJDK.21 --accept-source-agreements --accept-package-agreements --silent

if %errorlevel% == 0 (
    echo ✅ Java 21 instalado con winget
) else (
    echo ⚠️ Error con winget. Instalacion manual requerida.
    echo.
    echo 📋 PASOS MANUALES:
    echo 1. Ve a: https://learn.microsoft.com/en-us/java/openjdk/download
    echo 2. Descarga Microsoft Build of OpenJDK 21 - Windows x64 MSI
    echo 3. Ejecuta el instalador
    echo 4. Reinicia esta terminal
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Instalacion completada. Recargando variables...
echo Por favor cierra y abre nuevamente la terminal, luego ejecuta:
echo.
echo   probar_notificaciones.bat
echo.

:test_project
echo.
echo ========================================
echo   PROBANDO SISTEMA DE NOTIFICACIONES
echo ========================================
echo.
echo 📧 Configurado para: jc2583@gmail.com
echo 🔑 Password: sbxi ioio vdrq tkhj
echo.

echo 🔧 Compilando proyecto...
call mvnw.cmd clean compile -q

if %errorlevel% neq 0 (
    echo ❌ Error compilando. Verifica Java 21.
    pause
    exit /b 1
)

echo ✅ Compilacion exitosa
echo.
echo 🚀 Iniciando aplicacion...
echo ⏳ Espera 30-60 segundos...
echo 🌐 URL: http://localhost:8080
echo 📧 Prueba: http://localhost:8080/api/test/email
echo.

call mvnw.cmd spring-boot:run

pause