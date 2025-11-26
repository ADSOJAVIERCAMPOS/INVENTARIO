@echo off
echo ========================================
echo   INSTALACION RAPIDA - INVENTARIO ADSO
echo ========================================
echo.

echo 🔍 Verificando Java...
java -version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Java ya esta instalado
    goto test_app
) else (
    echo ❌ Java no encontrado. Instalando...
)

echo.
echo 📥 Instalando OpenJDK 21 con winget...
winget install Microsoft.OpenJDK.21 --accept-source-agreements --accept-package-agreements

if %errorlevel% == 0 (
    echo ✅ Java 21 instalado correctamente
) else (
    echo ⚠️ Error con winget. Probando con chocolatey...
    choco install openjdk21 -y
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ No se pudo instalar Java automaticamente.
        echo 📋 Por favor instala Java 21 manualmente:
        echo    1. Ve a: https://jdk.java.net/21/
        echo    2. Descarga OpenJDK 21 para Windows
        echo    3. Instala y configura JAVA_HOME
        echo.
        pause
        exit /b 1
    )
)

:test_app
echo.
echo ========================================
echo   PROBANDO SISTEMA DE NOTIFICACIONES
echo ========================================
echo.

echo 🧪 Sistema configurado para: jc2583@gmail.com
echo 📧 Correo de envio: jc2583@gmail.com
echo 🔑 Contraseña: sbxi ioio vdrq tkhj (configurada)
echo.

echo 🔧 Compilando aplicación...
call mvnw.cmd clean compile -q

if %errorlevel% neq 0 (
    echo ❌ Error en compilación
    pause
    exit /b 1
)

echo ✅ Compilación exitosa
echo.

echo 🚀 Iniciando aplicación...
echo ⏳ Espera aproximadamente 30 segundos...
echo 🌐 La aplicación estará en: http://localhost:8080
echo.

start /B cmd /c "mvnw.cmd spring-boot:run"

timeout /t 20 /nobreak >nul

echo.
echo 🧪 Probando notificaciones...
echo 📧 Enviando correo de prueba a jc2583@gmail.com...
echo.

curl -s "http://localhost:8080/api/test/email" 2>nul
if %errorlevel% == 0 (
    echo ✅ Prueba enviada
    echo 📬 Revisa tu correo jc2583@gmail.com
    echo 📧 Busca: "Prueba de Configuración - Sistema de Inventario ADSO"
) else (
    echo ⚠️ El servidor aún no está listo. Probando manualmente...
    echo 🌐 Ve a: http://localhost:8080/api/test/email
)

echo.
echo ========================================
echo   SISTEMA CONFIGURADO
echo ========================================
echo.
echo ✅ Aplicación ejecutándose en puerto 8080
echo 📧 Notificaciones activas para jc2583@gmail.com
echo.
echo 🧪 ENDPOINTS DE PRUEBA:
echo • http://localhost:8080/api/test/email
echo • http://localhost:8080/api/test/notificacion-acceso
echo • http://localhost:8080/api/test/status
echo.
echo 🌐 PÁGINA PRINCIPAL:
echo • http://localhost:8080/
echo.
echo 💡 TIP: Cada vez que visites la página principal,
echo    recibirás una notificación automática.
echo.

pause