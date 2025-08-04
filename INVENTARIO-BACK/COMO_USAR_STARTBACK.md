# 🚀 COMANDO STARTBACK - Inicio Rápido del Backend

## 📋 Nuevas Formas de Iniciar el Backend

### 🎯 **Opción 1: Script Batch (Recomendado)**
```bash
startback.bat
```
o simplemente hacer doble clic en el archivo `startback.bat`

### 🎯 **Opción 2: Script PowerShell**
```powershell
.\startback.ps1
```

### 🎯 **Opción 3: Tarea de VS Code**
- Presiona `Ctrl+Shift+P`
- Busca "Tasks: Run Task"
- Selecciona "startback"

### 🎯 **Opción 4: Terminal directo**
Desde la terminal en la carpeta del proyecto:
```bash
startback
```

## 💡 **¿Qué hace el comando startback?**

El comando `startback` ejecuta automáticamente:
1. ✅ Cambia al directorio correcto del proyecto
2. ✅ Ejecuta `mvn spring-boot:run`
3. ✅ Muestra información útil durante el inicio
4. ✅ Proporciona las URLs y credenciales de acceso

## 📊 **Información que muestra al iniciar:**

```
========================================
    INICIANDO BACKEND - INVENTARIO
========================================

🚀 Ejecutando aplicación Spring Boot...
📍 Puerto: 8080
🌐 URL: http://localhost:8080
👤 Usuario: Coordinador
🔑 Contraseña: JimmyVelandia

⏳ Iniciando servidor...
```

## 🌐 **URLs de Acceso Después del Inicio:**

- **Login**: http://localhost:8080/login
- **Dashboard**: http://localhost:8080/
- **Inventario**: http://localhost:8080/inventario
- **API REST**: http://localhost:8080/api/articulos

## 🔐 **Credenciales por Defecto:**

- **Usuario**: `Coordinador`
- **Contraseña**: `JimmyVelandia`
- **Rol**: ADMIN

## 📁 **Archivos Creados:**

- ✅ `startback.bat` - Script principal para Windows
- ✅ `startback.ps1` - Script alternativo PowerShell
- ✅ `tasks.json` - Tarea actualizada para VS Code

## 🎯 **Modo de Uso Recomendado:**

### Para uso diario:
```bash
# Simplemente ejecuta:
startback.bat
```

### Para desarrollo en VS Code:
- `Ctrl+Shift+P` → "Tasks: Run Task" → "startback"

## ⚡ **Ventajas del comando startback:**

1. **Más rápido**: No tienes que escribir `mvn spring-boot:run`
2. **Más claro**: Muestra información útil al iniciar
3. **Más cómodo**: Un solo comando fácil de recordar
4. **Más visual**: Interfaz mejorada con colores e iconos

---

**¡Ahora solo necesitas ejecutar `startback` para iniciar tu aplicación!** 🎉
