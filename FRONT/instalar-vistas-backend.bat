@echo off
echo ===================================================
echo   INSTALANDO VISTAS EN SPRING BOOT
echo ===================================================
echo.

set BACKEND_DIR=c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK
set SOURCE_DIR=c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-FRONT\backend-files

echo Verificando directorios...
if not exist "%BACKEND_DIR%" (
    echo ERROR: Directorio backend no encontrado: %BACKEND_DIR%
    pause
    exit /b 1
)

if not exist "%SOURCE_DIR%" (
    echo ERROR: Directorio de archivos fuente no encontrado: %SOURCE_DIR%
    pause
    exit /b 1
)

echo.
echo Creando estructura de carpetas...
mkdir "%BACKEND_DIR%\src\main\resources\templates" 2>nul
mkdir "%BACKEND_DIR%\src\main\java\INVENTARIO\demo\config" 2>nul

echo.
echo Copiando archivos de configuración...

echo - Copiando application.properties...
copy "%SOURCE_DIR%\application.properties" "%BACKEND_DIR%\src\main\resources\application.properties" >nul
if %errorlevel% == 0 (
    echo   ✅ application.properties copiado
) else (
    echo   ❌ Error copiando application.properties
)

echo - Copiando hello.html...
copy "%SOURCE_DIR%\hello.html" "%BACKEND_DIR%\src\main\resources\templates\hello.html" >nul
if %errorlevel% == 0 (
    echo   ✅ hello.html copiado
) else (
    echo   ❌ Error copiando hello.html
)

echo - Copiando index.html...
copy "%SOURCE_DIR%\index.html" "%BACKEND_DIR%\src\main\resources\templates\index.html" >nul
if %errorlevel% == 0 (
    echo   ✅ index.html copiado
) else (
    echo   ❌ Error copiando index.html
)

echo.
echo Copiando archivos Java...

echo - Copiando DemoController.java...
copy "%SOURCE_DIR%\DemoController.java" "%BACKEND_DIR%\src\main\java\INVENTARIO\demo\DemoController.java" >nul
if %errorlevel% == 0 (
    echo   ✅ DemoController.java copiado
) else (
    echo   ❌ Error copiando DemoController.java
)

echo - Copiando CorsConfig.java...
copy "%SOURCE_DIR%\CorsConfig.java" "%BACKEND_DIR%\src\main\java\INVENTARIO\demo\config\CorsConfig.java" >nul
if %errorlevel% == 0 (
    echo   ✅ CorsConfig.java copiado
) else (
    echo   ❌ Error copiando CorsConfig.java
)

echo - Copiando pom.xml...
copy "%SOURCE_DIR%\pom.xml" "%BACKEND_DIR%\pom.xml" >nul
if %errorlevel% == 0 (
    echo   ✅ pom.xml copiado
) else (
    echo   ❌ Error copiando pom.xml
)

echo.
echo ===================================================
echo   INSTALACIÓN COMPLETADA
echo ===================================================
echo.
echo Archivos instalados:
echo ✅ application.properties - Configuración deshabilitada spring.jpa.open-in-view
echo ✅ hello.html - Vista principal con logo SENA y tema ADSO
echo ✅ index.html - Página alternativa con diseño completo
echo ✅ DemoController.java - Controlador para vistas
echo ✅ CorsConfig.java - Configuración CORS
echo ✅ pom.xml - Dependencias actualizadas
echo.
echo URLs disponibles después de reiniciar:
echo 🌐 http://localhost:8080/ - Página principal
echo 🌐 http://localhost:8080/hello - Vista con Thymeleaf
echo 🌐 http://localhost:8080/status - Estado del sistema
echo 📊 http://localhost:8080/api/inventario - API REST
echo.
echo Próximos pasos:
echo 1. Reinicia la aplicación Spring Boot
echo 2. Verifica que no aparezca la advertencia de open-in-view
echo 3. Abre http://localhost:8080/hello en tu navegador
echo.

pause
