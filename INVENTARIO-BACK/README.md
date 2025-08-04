# 🚀 PROYECTO INVENTARIO - ADSO

## ✅ ARCHIVOS PRINCIPALES:
- `EJECUTAR_EN_SUPABASE.sql` - Script para configurar la base de datos
- Aplicación Spring Boot completa con entidades, repositorios y servicios

## 🎯 PASOS PARA EJECUTAR:

### 1. **Configurar Supabase:**
1. Abre tu proyecto en [Supabase](https://app.supabase.com)
2. Ve a "SQL Editor"
3. Copia y pega el contenido completo de `EJECUTAR_EN_SUPABASE.sql`
4. Ejecuta el script
5. Verifica que los resultados muestren: clave_primaria=1, indices_creados=4+, politicas_creadas=1

### 2. **Preparar datos:**
1. Convierte `Inventario Fisico.xlsx` a CSV
2. Nómbralo: `Inventario Fisico.xlsx - Inventario Fisico.csv.xlsx`
3. Colócalo en `src/main/resources/`

### 3. **Ejecutar aplicación:**
```bash
mvn spring-boot:run
```

## 🎉 ¡LISTO!
Tu aplicación cargará automáticamente los datos y estará lista para usar.
