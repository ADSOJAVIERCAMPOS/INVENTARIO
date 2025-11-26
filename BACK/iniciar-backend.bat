@echo off
echo ========================================
echo     INICIANDO BACKEND - INVENTARIO
echo ========================================
echo.
echo Compilando y ejecutando aplicacion...
echo Puerto: 8080
echo URL: http://localhost:8080
echo.

:: Limpiar y compilar
echo [1/3] Limpiando proyecto...
mvn clean -q

echo [2/3] Compilando aplicacion...
mvn compile -q

echo [3/3] Iniciando servidor Spring Boot...
echo.
echo BACKEND LISTO - Presiona Ctrl+C para detener
echo.

:: Ejecutar la aplicación usando exec:java en lugar de spring-boot:run
mvn exec:java -Dexec.mainClass="INVENTARIO.demo.DemoApplication" -Dexec.classpathScope="runtime"

pause