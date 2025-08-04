# 🔧 SOLUCIÓN: Scripts No Inician - INVENTARIO BACKEND

## ❌ Problema: `startback.bat` no inicia

## ✅ **SOLUCIONES DISPONIBLES:**

### **Opción 1: Usar Maven Wrapper (Recomendado)**
```bash
startback_wrapper.bat
```
**Ventaja**: No requiere Maven instalado globalmente

### **Opción 2: Diagnóstico del Sistema**
```bash
diagnostico.bat
```
**Propósito**: Identifica qué componente falla (Java, Maven, dependencias)

### **Opción 3: Método Alternativo**
```bash
startback_alternativo.bat
```
**Ventaja**: Usa un enfoque diferente para ejecutar

### **Opción 4: Comando Manual (Siempre funciona)**
```bash
cd "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"
mvnw.cmd spring-boot:run
```

### **Opción 5: Desde VS Code**
- `Ctrl+Shift+P`
- "Tasks: Run Task"
- Selecciona "Iniciar Spring Boot"

## 🔍 **PASOS PARA DIAGNÓSTICO:**

### 1. Ejecutar Diagnóstico:
```bash
diagnostico.bat
```

### 2. Verificar salida del diagnóstico:
- ✅ Java instalado
- ✅ Maven configurado  
- ✅ Puerto 8080 libre
- ✅ Archivo pom.xml presente

### 3. Si algo falla en el diagnóstico:
- **Java faltante**: Instalar JDK 21
- **Maven faltante**: Usar `startback_wrapper.bat`
- **Puerto ocupado**: Cambiar puerto o liberar el 8080

## 🚀 **SOLUCIÓN RÁPIDA:**

Si tienes prisa, usa directamente:
```bash
startback_wrapper.bat
```

Este script usa el Maven Wrapper incluido en el proyecto y **NO** requiere Maven instalado.

## 📋 **ARCHIVOS CREADOS:**

- ✅ `startback.bat` - Script principal mejorado
- ✅ `startback_wrapper.bat` - Usa Maven Wrapper (sin dependencias)
- ✅ `startback_alternativo.bat` - Método alternativo
- ✅ `diagnostico.bat` - Herramienta de diagnóstico

## 🎯 **ORDEN DE PRUEBA RECOMENDADO:**

1. **Primero**: `startback_wrapper.bat`
2. **Si falla**: `diagnostico.bat`
3. **Si persiste**: Comando manual con `mvnw.cmd spring-boot:run`

## 🌐 **URLs después del inicio exitoso:**

- **Login**: http://localhost:8080/login
- **Dashboard**: http://localhost:8080/
- **API**: http://localhost:8080/api/articulos

## 🔐 **Credenciales:**

- **Usuario**: `Coordinador`
- **Contraseña**: `JimmyVelandia`

---

**💡 TIP: Si ningún script funciona, usa el comando manual `mvnw.cmd spring-boot:run` desde la carpeta del proyecto.**
