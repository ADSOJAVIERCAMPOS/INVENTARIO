Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN SISTEMA - INVENTARIO ADSO" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Java está instalado
Write-Host "🔍 Verificando Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    Write-Host "✅ Java encontrado: $($javaVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "❌ Java no encontrado. Instalando..." -ForegroundColor Red
    
    # Instalar Java usando Chocolatey si está disponible
    try {
        choco install openjdk21 -y
        Write-Host "✅ Java 21 instalado con Chocolatey" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Chocolatey no disponible. Descargando Java..." -ForegroundColor Yellow
        
        # Descargar e instalar OpenJDK manualmente
        $javaUrl = "https://download.java.net/java/GA/jdk21.0.1/415e3f918a1100563002496b3a78441d/12/GPL/openjdk-21.0.1_windows-x64_bin.zip"
        $javaZip = "$env:TEMP\openjdk-21.zip"
        $javaDir = "C:\Program Files\Java\jdk-21"
        
        Write-Host "📥 Descargando OpenJDK 21..." -ForegroundColor Blue
        Invoke-WebRequest -Uri $javaUrl -OutFile $javaZip
        
        Write-Host "📂 Extrayendo Java..." -ForegroundColor Blue
        Expand-Archive -Path $javaZip -DestinationPath "C:\Program Files\Java" -Force
        
        # Configurar JAVA_HOME
        [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaDir, "Machine")
        [Environment]::SetEnvironmentVariable("PATH", "$env:PATH;$javaDir\bin", "Machine")
        
        Write-Host "✅ Java instalado y configurado" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🧪 Probando sistema de notificaciones..." -ForegroundColor Yellow
Write-Host ""

# Cambiar al directorio correcto
$backendPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendPath

Write-Host "📍 Directorio actual: $backendPath" -ForegroundColor Cyan
Write-Host ""

# Compilar la aplicación
Write-Host "🔧 Compilando aplicación..." -ForegroundColor Yellow
try {
    & .\mvnw.cmd clean compile -q
    Write-Host "✅ Compilación exitosa" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en compilación: $_" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "🚀 Iniciando aplicación..." -ForegroundColor Green
Write-Host "📧 Sistema configurado para notificar a: jc2583@gmail.com" -ForegroundColor Magenta
Write-Host "🌐 URL: http://localhost:8080" -ForegroundColor Blue
Write-Host ""

# Iniciar aplicación
try {
    & .\mvnw.cmd spring-boot:run
} catch {
    Write-Host "❌ Error iniciando aplicación: $_" -ForegroundColor Red
}

Read-Host "Presiona Enter para salir"