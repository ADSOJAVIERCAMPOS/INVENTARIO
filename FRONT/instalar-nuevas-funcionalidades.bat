@echo off
echo ================================
echo   INSTALACION DE DEPENDENCIAS   
echo ================================

echo 📦 Instalando dependencias del Frontend...
cd "c:\Users\USUARIO\OneDrive - SENA\Escritorio\INVENTARIO ADSO\FRONT"

echo.
echo 📥 Ejecutando npm install...
npm install

echo.
echo ✅ Dependencias instaladas:
echo   - html5-qrcode (escáner QR/códigos de barras)
echo   - lodash (utilidades de JavaScript)
echo   - @types/lodash (tipos TypeScript)

echo.
echo 🔧 Compilando proyecto...
npm run build

echo.
echo ================================
echo   INSTALACION COMPLETADA       
echo ================================
echo.
echo ✅ Nuevas funcionalidades instaladas:
echo   📱 Escáner QR/Código de barras  
echo   🔍 Búsqueda inteligente
echo   📄 Exportar a PDF
echo   📱 Diseño responsive mejorado
echo.

pause