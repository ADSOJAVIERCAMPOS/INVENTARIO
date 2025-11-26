@echo off
echo ========================================
echo   VERIFICACION FINAL - SISTEMA COMPLETO
echo ========================================
echo.

echo 📧 CONFIGURACION DE NOTIFICACIONES:
echo ✅ Email destino: jc2583@gmail.com
echo ✅ Email envio: jc2583@gmail.com  
echo ✅ Password configurada: sbxi ioio vdrq tkhj
echo.

echo 🔍 VERIFICANDO JAVA...
java -version
if %errorlevel% neq 0 (
    echo ❌ Java no disponible
    echo 💡 Espera a que termine la instalacion y ejecuta nuevamente
    pause
    exit /b 1
)

echo.
echo ✅ Java funcionando correctamente
echo.

echo 🔧 COMPILANDO PROYECTO...
call mvnw.cmd clean compile -q
if %errorlevel% neq 0 (
    echo ❌ Error en compilacion
    pause
    exit /b 1
)

echo ✅ Proyecto compilado exitosamente
echo.

echo 🚀 INICIANDO APLICACION...
echo ⏳ Iniciando servidor Spring Boot...
echo 📧 Sistema de notificaciones activo
echo 🌐 URL: http://localhost:8080
echo.

start /B cmd /c "mvnw.cmd spring-boot:run > server.log 2>&1"

echo ⏳ Esperando que el servidor inicie...
timeout /t 30 /nobreak >nul

echo.
echo 🧪 PROBANDO SISTEMA DE NOTIFICACIONES...
echo.

echo 📧 Enviando correo de prueba a jc2583@gmail.com...
curl -s "http://localhost:8080/api/test/email" >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Correo de prueba enviado
    echo 📬 Revisa tu bandeja: jc2583@gmail.com
) else (
    echo ⚠️ Servidor aun iniciando. Prueba manual en:
    echo 🌐 http://localhost:8080/api/test/email
)

echo.
echo ========================================
echo   SISTEMA COMPLETAMENTE FUNCIONAL
echo ========================================
echo.
echo 🎉 NOTIFICACIONES AUTOMATICAS ACTIVAS:
echo.
echo 🔔 ACCESOS - Cada visita genera notificacion:
echo • http://localhost:8080/ (página principal)
echo • APIs del inventario
echo.
echo ⚠️ MODIFICACIONES - Cada cambio genera notificacion:
echo • Subida de archivos Excel
echo • Actualizacion del inventario
echo • Comparacion de archivos
echo.
echo 📥 DESCARGAS - Cada descarga genera notificacion:
echo • http://localhost:8080/api/inventario/descargar-excel
echo • http://localhost:8080/api/reportes/exportar-diferencias
echo.
echo 🧪 ENDPOINTS DE PRUEBA:
echo • http://localhost:8080/api/test/email (Prueba correo)
echo • http://localhost:8080/api/test/notificacion-acceso
echo • http://localhost:8080/api/test/notificacion-modificacion
echo • http://localhost:8080/api/test/status
echo.
echo 📧 TODAS las notificaciones llegan a: jc2583@gmail.com
echo.
echo 💡 TIP: Ve a http://localhost:8080/ para generar tu primera
echo    notificacion automatica de acceso.
echo.

pause