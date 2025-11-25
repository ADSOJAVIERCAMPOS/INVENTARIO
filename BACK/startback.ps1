Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    INICIANDO BACKEND - INVENTARIO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Ejecutando aplicación Spring Boot..." -ForegroundColor Yellow
Write-Host "📍 Puerto: 8080" -ForegroundColor White
Write-Host "🌐 URL: http://localhost:8080" -ForegroundColor Blue
Write-Host "👤 Usuario: Coordinador" -ForegroundColor Magenta
Write-Host "🔑 Contraseña: JimmyVelandia" -ForegroundColor Magenta
Write-Host ""
Write-Host "⏳ Iniciando servidor..." -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del proyecto
Set-Location "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"

# Ejecutar el comando Maven
& mvn spring-boot:run

Read-Host "Presiona Enter para salir"
