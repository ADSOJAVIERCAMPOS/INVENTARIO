@echo off
title VERIFICACION - Sistema de Inventario
color 0B
echo ========================================
echo     VERIFICACION DEL SISTEMA
echo ========================================
echo.

REM Cambiar al directorio del proyecto
cd /d "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"
echo 📁 Directorio: %CD%
echo.

echo 🔍 Verificando estructura del proyecto...
echo.

REM Verificar archivos clave
if exist "src\main\java\INVENTARIO\demo\DemoApplication.java" (
    echo ✅ DemoApplication.java encontrado
) else (
    echo ❌ DemoApplication.java NO encontrado
)

if exist "src\main\java\INVENTARIO\demo\DemoController.java" (
    echo ✅ DemoController.java encontrado
) else (
    echo ❌ DemoController.java NO encontrado
)

if exist "src\main\java\INVENTARIO\demo\model\Articulo.java" (
    echo ✅ Articulo.java encontrado
) else (
    echo ❌ Articulo.java NO encontrado
)

if exist "src\main\resources\templates\hello.html" (
    echo ✅ hello.html encontrado
) else (
    echo ❌ hello.html NO encontrado
)

if exist "src\main\resources\templates\inventario.html" (
    echo ✅ inventario.html encontrado
) else (
    echo ❌ inventario.html NO encontrado
)

echo.
echo 🔍 Verificando que NO existan archivos problemáticos...

if exist "src\main\java\INVENTARIO\demo\config_backup" (
    echo ❌ config_backup aún presente (debe moverse)
) else (
    echo ✅ config_backup no presente en src/
)

if exist "src\main\java\INVENTARIO\demo\service_backup" (
    echo ❌ service_backup aún presente (debe moverse)
) else (
    echo ✅ service_backup no presente en src/
)

echo.
echo 🔧 Compilando proyecto...
call mvnw.cmd clean compile -q

if errorlevel 1 (
    echo ❌ Error en la compilación
    echo.
    echo 💡 Ejecuta manualmente: mvnw.cmd clean compile
    echo    para ver detalles del error
) else (
    echo ✅ Compilación exitosa
    echo.
    echo 🚀 ¡Todo listo! Puedes ejecutar:
    echo    startback_wrapper.bat
    echo.
    echo 🌐 URLs que estarán disponibles:
    echo    http://localhost:8080/
    echo    http://localhost:8080/hello
    echo    http://localhost:8080/inventario
    echo    http://localhost:8080/api/articulos
)

echo.
echo ========================================
pause
