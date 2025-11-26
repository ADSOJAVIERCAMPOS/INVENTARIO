@echo off
echo ================================
echo   PRUEBA RAPIDA DE CORREO       
echo ================================

REM Cargar variables de entorno desde .env
if exist .env (
    echo Cargando variables de entorno...
    for /f "usebackq tokens=1,* delims==" %%i in (".env") do (
        if not "%%i"=="" (
            if not "%%i"=="REM" (
                if not "%%i"=="#" (
                    set %%i=%%j
                )
            )
        )
    )
)

echo.
echo Variables configuradas:
echo MAIL_USERNAME=%MAIL_USERNAME%
echo NOTIFICATION_EMAIL=%NOTIFICATION_EMAIL%
echo.

echo Probando conexion al servidor SMTP Gmail...
telnet smtp.gmail.com 587

echo.
echo ================================
pause