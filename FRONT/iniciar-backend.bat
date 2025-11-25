@echo off
echo ===================================================
echo    INICIANDO SERVIDOR SPRING BOOT - Puerto 8080
echo ===================================================
echo.

cd /d "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"

echo Verificando puerto 8080...
netstat -ano | findstr :8080
if %errorlevel% == 0 (
    echo Puerto 8080 está en uso. Terminando procesos...
    for /f "tokens=5" %%p in ('netstat -ano ^| findstr :8080') do (
        taskkill /PID %%p /F >nul 2>&1
    )
    timeout /t 2 >nul
)

echo.
echo Iniciando servidor Spring Boot...
echo Presiona Ctrl+C para detener el servidor
echo.

mvn spring-boot:run

pause
