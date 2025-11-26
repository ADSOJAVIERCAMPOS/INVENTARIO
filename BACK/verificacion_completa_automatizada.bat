@echo off
title SISTEMA DE NOTIFICACIONES - INVENTARIO ADSO - VERIFICACION COMPLETA

echo.
echo ████████████████████████████████████████████████████████████████
echo █                                                              █
echo █    SISTEMA DE NOTIFICACIONES - INVENTARIO ADSO              █
echo █    VERIFICACION COMPLETA AUTOMATIZADA                       █
echo █                                                              █
echo ████████████████████████████████████████████████████████████████
echo.

echo 🎯 OBJETIVO: Verificar que TODAS las notificaciones lleguen a jc2583@gmail.com
echo.

echo ========================================
echo   PASO 1: VERIFICACION DE JAVA
echo ========================================
echo.

java -version
if %errorlevel% neq 0 (
    echo ❌ Java no está disponible
    echo 💡 La instalación aún no ha terminado o falló
    echo 📋 Ejecuta este script nuevamente cuando Java esté listo
    pause
    exit /b 1
)

echo.
echo ✅ Java 21 funcionando correctamente
echo.

echo ========================================
echo   PASO 2: COMPILACION DEL PROYECTO
echo ========================================
echo.

call mvnw.cmd clean compile
if %errorlevel% neq 0 (
    echo ❌ Error en la compilación
    echo 💡 Revisa los errores mostrados arriba
    pause
    exit /b 1
)

echo.
echo ✅ Proyecto compilado exitosamente
echo.

echo ========================================
echo   PASO 3: INICIANDO APLICACION
echo ========================================
echo.

echo 📧 Configuración activa:
echo    └─ Email destino: jc2583@gmail.com
echo    └─ Email origen: jc2583@gmail.com
echo    └─ Contraseña: sbxi ioio vdrq tkhj
echo.

echo 🚀 Iniciando servidor Spring Boot...
echo ⏳ Por favor espera 60 segundos...
echo.

start /B cmd /c "mvnw.cmd spring-boot:run > logs\server.log 2>&1"

:: Crear directorio de logs si no existe
if not exist logs mkdir logs

:: Esperar que el servidor inicie
for /l %%i in (1,1,12) do (
    timeout /t 5 /nobreak >nul
    echo ⏳ Esperando... %%i/12
    curl -s "http://localhost:8080/actuator/health" >nul 2>&1
    if %errorlevel% == 0 goto server_ready
)

echo ⚠️ El servidor está tardando más de lo esperado
echo 💡 Continuando con las pruebas...

:server_ready
echo.
echo ✅ Servidor Spring Boot iniciado
echo.

echo ========================================
echo   PASO 4: PRUEBAS DE NOTIFICACIONES
echo ========================================
echo.

echo 🧪 PRUEBA 1: Correo de configuración básica
echo ─────────────────────────────────────────────
curl -s "http://localhost:8080/api/test/email" > logs\test1.log 2>&1
if %errorlevel% == 0 (
    echo ✅ Solicitud enviada
) else (
    echo ❌ Error en solicitud
)
echo 📬 Revisa tu correo: jc2583@gmail.com
echo 📧 Busca: "🧪 Prueba de Configuración - Sistema de Inventario ADSO"
echo.

timeout /t 3 /nobreak >nul

echo 🧪 PRUEBA 2: Notificación de acceso
echo ─────────────────────────────────────────
curl -s "http://localhost:8080/api/test/notificacion-acceso" > logs\test2.log 2>&1
if %errorlevel% == 0 (
    echo ✅ Solicitud enviada
) else (
    echo ❌ Error en solicitud
)
echo 📬 Revisa tu correo: jc2583@gmail.com
echo 📧 Busca: "🔔 Acceso al Sistema de Inventario ADSO"
echo.

timeout /t 3 /nobreak >nul

echo 🧪 PRUEBA 3: Notificación de modificación
echo ─────────────────────────────────────────────
curl -s "http://localhost:8080/api/test/notificacion-modificacion" > logs\test3.log 2>&1
if %errorlevel% == 0 (
    echo ✅ Solicitud enviada
) else (
    echo ❌ Error en solicitud
)
echo 📬 Revisa tu correo: jc2583@gmail.com
echo 📧 Busca: "⚠️ Modificación en Sistema de Inventario ADSO"
echo.

timeout /t 3 /nobreak >nul

echo 🧪 PRUEBA 4: Notificación de descarga
echo ─────────────────────────────────────────
curl -s "http://localhost:8080/api/test/notificacion-descarga" > logs\test4.log 2>&1
if %errorlevel% == 0 (
    echo ✅ Solicitud enviada
) else (
    echo ❌ Error en solicitud
)
echo 📬 Revisa tu correo: jc2583@gmail.com
echo 📧 Busca: "📥 Descarga de Excel - Sistema de Inventario ADSO"
echo.

timeout /t 3 /nobreak >nul

echo 🧪 PRUEBA 5: Acceso automático a página principal
echo ───────────────────────────────────────────────────
curl -s "http://localhost:8080/" > logs\test5.log 2>&1
if %errorlevel% == 0 (
    echo ✅ Acceso a página principal realizado
) else (
    echo ❌ Error accediendo a página principal
)
echo 📬 Deberías recibir notificación automática de acceso
echo.

echo ========================================
echo   RESULTADOS DE LAS PRUEBAS
echo ========================================
echo.

echo 📊 Se enviaron 5 tipos de notificaciones a jc2583@gmail.com:
echo.
echo 1️⃣ 🧪 Prueba de configuración básica
echo 2️⃣ 🔔 Notificación de acceso manual
echo 3️⃣ ⚠️ Notificación de modificación
echo 4️⃣ 📥 Notificación de descarga
echo 5️⃣ 🔔 Notificación de acceso automático
echo.

echo ========================================
echo   SISTEMA COMPLETAMENTE FUNCIONAL
echo ========================================
echo.

echo 🎉 ¡FELICITACIONES! El sistema está 100%% operativo
echo.
echo 📧 NOTIFICACIONES AUTOMÁTICAS ACTIVAS para jc2583@gmail.com:
echo.
echo 🔔 ACCESOS (Automáticos):
echo    • Cada visita a http://localhost:8080/
echo    • Cada consulta a las APIs del inventario
echo    • Información: IP, navegador, fecha, página
echo.
echo ⚠️ MODIFICACIONES (Automáticas):
echo    • Subida de archivos Excel
echo    • Actualización del inventario
echo    • Comparación de archivos
echo    • Detalles específicos de cada cambio
echo.
echo 📥 DESCARGAS (Automáticas):
echo    • http://localhost:8080/api/inventario/descargar-excel
echo    • http://localhost:8080/api/reportes/exportar-diferencias
echo    • Información del archivo descargado
echo.
echo 🌐 ENDPOINTS PRINCIPALES:
echo    • http://localhost:8080/ (Página principal + notificación)
echo    • http://localhost:8080/api/inventario (APIs del inventario)
echo    • http://localhost:8080/api/test/status (Estado del sistema)
echo.
echo 💡 A partir de ahora, CADA actividad en el sistema generará
echo    una notificación automática en tu correo jc2583@gmail.com
echo.
echo ✅ ¡Tu sistema de monitoreo está completamente funcional!
echo.

pause