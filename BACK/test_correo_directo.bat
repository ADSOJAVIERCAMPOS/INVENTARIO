@echo off
echo ================================
echo   PRUEBA DIRECTA DE CORREO      
echo ================================

REM Cargar variables de entorno desde .env
if exist .env (
    echo Cargando variables de entorno desde .env...
    for /f "usebackq tokens=1,* delims==" %%i in (".env") do (
        if not "%%i"=="" (
            if not "%%i"=="REM" (
                if not "%%i"=="#" (
                    echo Configurando: %%i=%%j
                    set %%i=%%j
                )
            )
        )
    )
) else (
    echo ADVERTENCIA: Archivo .env no encontrado
)

echo.
echo ================================
echo   INICIANDO APP SOLO CORREO     
echo ================================
echo.
echo - Puerto: 8080
echo - Solo servicio de correo (sin BD)
echo - Destinatario: jc2583@gmail.com
echo - Endpoints disponibles:
echo   * GET  http://localhost:8080/api/test-mail/send
echo   * GET  http://localhost:8080/api/test-mail/config
echo.

REM Ejecutar aplicación específica de correo
.\mvnw.cmd exec:java -Dexec.mainClass="INVENTARIO.demo.MailTestApplication" -Dexec.classpathScope=runtime

echo.
echo ================================
echo   PRUEBA FINALIZADA            
echo ================================
pause