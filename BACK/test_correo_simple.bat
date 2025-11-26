@echo off
echo ================================
echo   PRUEBA DIRECTA CORREO GMAIL   
echo ================================

REM Cargar variables de entorno desde .env
if exist .env (
    echo Cargando variables desde .env...
    for /f "usebackq tokens=1,* delims==" %%i in (".env") do (
        if not "%%i"=="" (
            if not "%%i"=="REM" (
                if not "%%i"=="#" (
                    set %%i=%%j
                )
            )
        )
    )
) else (
    echo ADVERTENCIA: Archivo .env no encontrado
)

echo.
echo Variables configuradas:
echo MAIL_USERNAME=%MAIL_USERNAME%
echo NOTIFICATION_EMAIL=%NOTIFICATION_EMAIL%
echo.

echo Compilando y ejecutando prueba de correo...
echo.

REM Ejecutar la prueba directa
.\mvnw.cmd exec:java -Dexec.mainClass="INVENTARIO.demo.test.DirectMailTest"

echo.
echo ================================
pause