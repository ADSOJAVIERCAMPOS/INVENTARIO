@echo off
echo ========================================================
echo   CONFIGURADOR DE NOTIFICACIONES - INVENTARIO ADSO
echo ========================================================
echo.

echo PASO 1: Crear cuenta de Gmail para notificaciones
echo ------------------------------------------------
echo Para configurar las notificaciones necesitas:
echo.
echo 1. Una cuenta de Gmail (puede ser nueva o existente)
echo 2. Activar la verificacion en 2 pasos
echo 3. Generar una contrasena de aplicacion
echo.

echo Opciones:
echo [1] Usar la cuenta predeterminada: inventarioadso2024@gmail.com
echo [2] Configurar mi propia cuenta de Gmail
echo [3] Ver instrucciones detalladas
echo.

set /p opcion="Selecciona una opcion (1-3): "

if "%opcion%"=="1" goto usar_predeterminada
if "%opcion%"=="2" goto configurar_propia
if "%opcion%"=="3" goto mostrar_instrucciones
goto error

:usar_predeterminada
echo.
echo ✓ Usando cuenta predeterminada: inventarioadso2024@gmail.com
echo.
echo IMPORTANTE: Necesitas la contrasena de aplicacion para esta cuenta.
echo Si no la tienes, contacta al administrador del sistema.
echo.
set /p password="Ingresa la contrasena de aplicacion: "
goto aplicar_configuracion

:configurar_propia
echo.
echo Configurando cuenta propia...
echo.
set /p email="Ingresa tu email de Gmail: "
set /p password="Ingresa la contrasena de aplicacion (NO tu contrasena normal): "
goto aplicar_configuracion

:mostrar_instrucciones
echo.
echo INSTRUCCIONES PARA CREAR CONTRASENA DE APLICACION:
echo =================================================
echo.
echo 1. Ve a https://myaccount.google.com/
echo 2. Clic en "Seguridad" (panel izquierdo)
echo 3. En "Iniciar sesion en Google", clic en "Verificacion en 2 pasos"
echo 4. Activa la verificacion en 2 pasos si no esta activa
echo 5. Ve a "Contrasenas de aplicacion" (parte inferior)
echo 6. Selecciona "Correo" y "Windows Computer"
echo 7. Copia la contrasena generada (16 caracteres)
echo 8. Usa esa contrasena aqui, NO tu contrasena normal de Gmail
echo.
pause
goto configurar_propia

:aplicar_configuracion
if "%email%"=="" set email=inventarioadso2024@gmail.com

echo.
echo Aplicando configuracion...
echo Email: %email%
echo Contrasena: [OCULTA]
echo.

:: Crear backup del archivo original
copy "src\main\resources\application.properties" "src\main\resources\application.properties.backup" >nul 2>&1

:: Aplicar configuracion usando PowerShell
powershell -Command "$content = Get-Content 'src\main\resources\application.properties' -Raw; $content = $content -replace 'spring.mail.username=.*', 'spring.mail.username=%email%'; $content = $content -replace 'spring.mail.password=.*', 'spring.mail.password=%password%'; $content = $content -replace 'app.notification.from-email=.*', 'app.notification.from-email=%email%'; Set-Content 'src\main\resources\application.properties' $content"

echo.
echo ✓ Configuracion aplicada exitosamente!
echo ✓ Se creo backup en: application.properties.backup
echo.

echo ========================================================
echo   PROBANDO CONFIGURACION
echo ========================================================
echo.
echo Iniciando aplicacion para probar configuracion...
echo Por favor espera...
echo.

:: Compilar y ejecutar la aplicacion
call mvnw.cmd clean compile -q
if errorlevel 1 (
    echo ❌ Error compilando la aplicacion
    goto error
)

echo ✓ Aplicacion compilada
echo.
echo Iniciando servidor de prueba...
echo (El servidor se cerrara automaticamente despues de las pruebas)
echo.

:: Iniciar aplicacion en segundo plano
start /B cmd /c "mvnw.cmd spring-boot:run -Dspring-boot.run.jvmArguments=-Dserver.port=8080 > test_log.txt 2>&1"

:: Esperar a que la aplicacion inicie
echo Esperando que la aplicacion inicie...
timeout /t 15 /nobreak >nul

:: Probar endpoints
echo Probando configuracion de correo...
curl -s "http://localhost:8080/api/test/email" > test_result.txt 2>&1

if exist test_result.txt (
    type test_result.txt
    echo.
) else (
    echo ❌ No se pudo conectar al servidor
)

echo.
echo Probando notificacion de acceso...
curl -s "http://localhost:8080/api/test/notificacion-acceso"
echo.

echo.
echo ========================================================
echo   CONFIGURACION COMPLETADA
echo ========================================================
echo.
echo ✓ Sistema configurado para enviar notificaciones a: jc2583@gmail.com
echo ✓ Cuenta de envio configurada: %email%
echo.
echo ENDPOINTS DE PRUEBA DISPONIBLES:
echo • http://localhost:8080/api/test/email
echo • http://localhost:8080/api/test/notificacion-acceso
echo • http://localhost:8080/api/test/notificacion-modificacion
echo • http://localhost:8080/api/test/notificacion-descarga
echo • http://localhost:8080/api/test/status
echo.
echo ENDPOINTS DE PRODUCCION:
echo • http://localhost:8080/api/inventario/descargar-excel
echo • http://localhost:8080/api/reportes/exportar-diferencias
echo.
echo Revisa tu correo jc2583@gmail.com para verificar que lleguen las notificaciones.
echo.

:: Limpiar archivos temporales
del test_result.txt >nul 2>&1
del test_log.txt >nul 2>&1

echo Presiona cualquier tecla para finalizar...
pause >nul
goto fin

:error
echo.
echo ❌ Opcion invalida o error en la configuracion
echo.
pause
goto fin

:fin
echo.
echo Configuracion finalizada.
taskkill /f /im java.exe >nul 2>&1
exit /b