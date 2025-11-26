@echo off
echo ================================
echo   PRUEBA DEL SISTEMA DE CORREO  
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
echo   INICIANDO MODO PRUEBA CORREO  
echo ================================
echo.
echo - Puerto: 8080
echo - Perfil: mail-test (sin base de datos)
echo - Destinatario: jc2583@gmail.com
echo - Endpoints de prueba disponibles:
echo   * GET  http://localhost:8080/api/test-mail/send
echo   * POST http://localhost:8080/api/test-mail/modification  
echo   * GET  http://localhost:8080/api/test-mail/download
echo   * GET  http://localhost:8080/api/test-mail/config
echo.

REM Ejecutar Spring Boot con perfil de prueba
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mail-test

echo.
echo ================================
echo   PRUEBA FINALIZADA            
echo ================================
pause