@echo off
echo ================================
echo   CARGANDO CONFIGURACION SEGURA  
echo ================================

REM Cargar variables de entorno desde .env
if exist .env (
    echo Cargando variables de entorno desde .env...
    for /f "usebackq tokens=1,2 delims==" %%i in (".env") do (
        if not "%%i"=="" if not "%%i"=="#" (
            echo Configurando: %%i=%%j
            set %%i=%%j
        )
    )
) else (
    echo ADVERTENCIA: Archivo .env no encontrado
    echo Usando configuracion por defecto
)

echo.
echo ================================
echo   INICIANDO BACKEND SPRING BOOT  
echo ================================
echo.

REM Verificar Java
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java no encontrado
    pause
    exit /b 1
)

echo.
echo Ejecutando aplicacion Spring Boot...
echo Puerto: 8080
echo Perfil: default
echo.

REM Ejecutar Spring Boot
.\mvnw.cmd spring-boot:run

echo.
echo ================================
echo   APLICACION FINALIZADA         
echo ================================
pause