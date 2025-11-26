Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALADOR JAVA 21 - INVENTARIO ADSO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar estado actual
Write-Host "🔍 DIAGNÓSTICO ACTUAL:" -ForegroundColor Yellow
Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor White
Write-Host "PATH contiene Java: $((($env:PATH -split ';') | Where-Object { $_ -like '*java*' }) -ne $null)" -ForegroundColor White

# Verificar si Java funciona
Write-Host ""
Write-Host "🧪 Probando Java actual..." -ForegroundColor Yellow
try {
    $javaTest = & java -version 2>&1
    Write-Host "✅ Java funcionando: $($javaTest[0])" -ForegroundColor Green
    $javaInstalled = $true
} catch {
    Write-Host "❌ Java no funciona correctamente" -ForegroundColor Red
    $javaInstalled = $false
}

if (-not $javaInstalled) {
    Write-Host ""
    Write-Host "🚀 INSTALANDO JAVA 21..." -ForegroundColor Green
    
    # Opción 1: Usar winget (Windows Package Manager)
    Write-Host "📥 Intentando instalación con winget..." -ForegroundColor Blue
    try {
        & winget install Microsoft.OpenJDK.21 --accept-source-agreements --accept-package-agreements --silent
        Write-Host "✅ Java 21 instalado con winget" -ForegroundColor Green
        $installSuccess = $true
    } catch {
        Write-Host "⚠️ Winget falló. Probando método alternativo..." -ForegroundColor Yellow
        $installSuccess = $false
    }
    
    # Opción 2: Descargar manualmente si winget falla
    if (-not $installSuccess) {
        Write-Host "📥 Descargando Java 21 manualmente..." -ForegroundColor Blue
        
        $javaUrl = "https://aka.ms/download-jdk/microsoft-jdk-21.0.4-windows-x64.msi"
        $javaInstaller = "$env:TEMP\microsoft-jdk-21-installer.msi"
        
        try {
            Invoke-WebRequest -Uri $javaUrl -OutFile $javaInstaller -UseBasicParsing
            Write-Host "✅ Descarga completada" -ForegroundColor Green
            
            Write-Host "🔧 Instalando Java 21..." -ForegroundColor Blue
            Start-Process msiexec.exe -Wait -ArgumentList "/i $javaInstaller /quiet /norestart ADDLOCAL=FeatureMain,FeatureEnvironment,FeatureJarFileRunWith,FeatureJavaHome"
            Write-Host "✅ Instalación completada" -ForegroundColor Green
            
            # Limpiar archivo temporal
            Remove-Item $javaInstaller -ErrorAction SilentlyContinue
            
        } catch {
            Write-Host "❌ Error en instalación manual: $_" -ForegroundColor Red
            Write-Host ""
            Write-Host "📋 INSTALACIÓN MANUAL REQUERIDA:" -ForegroundColor Yellow
            Write-Host "1. Ve a: https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-21" -ForegroundColor White
            Write-Host "2. Descarga Microsoft Build of OpenJDK 21 (.msi)" -ForegroundColor White
            Write-Host "3. Ejecuta el instalador" -ForegroundColor White
            Write-Host "4. Reinicia PowerShell" -ForegroundColor White
            Read-Host "Presiona Enter después de instalar Java manualmente"
        }
    }
    
    # Recargar variables de entorno
    Write-Host "🔄 Recargando variables de entorno..." -ForegroundColor Blue
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    # Verificar instalación
    Write-Host ""
    Write-Host "🧪 Verificando instalación..." -ForegroundColor Yellow
    try {
        $javaVersion = & java -version 2>&1
        Write-Host "✅ Java instalado correctamente: $($javaVersion[0])" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Reinicia PowerShell y ejecuta nuevamente" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PROBANDO SISTEMA DE NOTIFICACIONES" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Cambiar al directorio del proyecto
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "📍 Directorio: $projectPath" -ForegroundColor White
Write-Host "📧 Configurado para: jc2583@gmail.com" -ForegroundColor Magenta
Write-Host ""

# Compilar
Write-Host "🔧 Compilando proyecto..." -ForegroundColor Yellow
try {
    & .\mvnw.cmd clean compile -q
    Write-Host "✅ Compilación exitosa" -ForegroundColor Green
} catch {
    Write-Host "❌ Error compilando: $_" -ForegroundColor Red
    Write-Host "💡 Verifica que Java 21 esté correctamente instalado" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host ""
Write-Host "🚀 INICIANDO APLICACIÓN..." -ForegroundColor Green
Write-Host "⏳ Espera 30-60 segundos para que inicie completamente" -ForegroundColor Yellow
Write-Host "🌐 URL: http://localhost:8080" -ForegroundColor Blue
Write-Host ""

# Iniciar aplicación
& .\mvnw.cmd spring-boot:run

Read-Host "Presiona Enter para salir"