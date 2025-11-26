@echo off
echo ================================
echo   ACTUALIZANDO BASE DE DATOS    
echo ================================

echo 📊 Agregando campos para QR y código de barras...
echo.

echo 🔧 Script SQL para ejecutar en Supabase:
echo.
echo -- Agregar campos de código de barras y QR a la tabla articulos
echo ALTER TABLE articulos 
echo ADD COLUMN IF NOT EXISTS codigo_barras VARCHAR(255) UNIQUE,
echo ADD COLUMN IF NOT EXISTS qr_code VARCHAR(255);
echo.
echo -- Crear índices para búsquedas rápidas
echo CREATE INDEX IF NOT EXISTS idx_articulos_codigo_barras ON articulos(codigo_barras);
echo CREATE INDEX IF NOT EXISTS idx_articulos_qr_code ON articulos(qr_code);
echo CREATE INDEX IF NOT EXISTS idx_articulos_descripcion ON articulos USING gin(to_tsvector('spanish', descripcion));
echo.
echo -- Actualizar datos existentes (opcional)
echo -- UPDATE articulos SET codigo_barras = 'BAR' || id WHERE codigo_barras IS NULL;
echo -- UPDATE articulos SET qr_code = 'QR' || id WHERE qr_code IS NULL;

echo.
echo ================================
echo   INSTRUCCIONES                
echo ================================
echo.
echo 1. Copia el script SQL de arriba
echo 2. Ve a https://supabase.com/dashboard
echo 3. Abre tu proyecto INVENTARIO
echo 4. Ve a SQL Editor
echo 5. Pega y ejecuta el script
echo.
echo ✅ Después de ejecutar el SQL, las nuevas funcionalidades estarán disponibles
echo.

pause