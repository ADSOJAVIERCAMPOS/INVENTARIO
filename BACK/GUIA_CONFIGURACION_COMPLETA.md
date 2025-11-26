# 🚀 GUÍA COMPLETA DE CONFIGURACIÓN - SISTEMA DE NOTIFICACIONES

## ⚡ CONFIGURACIÓN RÁPIDA (Recomendada)

### Opción 1: Configurador Automático
```bash
# Ejecutar el configurador automático
cd BACK
configurar_notificaciones.bat
```

### Opción 2: Configuración Manual
Editar `src/main/resources/application.properties` y cambiar:
```properties
spring.mail.username=TU_EMAIL@gmail.com
spring.mail.password=TU_CONTRASEÑA_DE_APLICACION
app.notification.from-email=TU_EMAIL@gmail.com
```

---

## 📋 PASOS DETALLADOS PARA CONFIGURAR GMAIL

### 1. 📧 Preparar Cuenta de Gmail

**Opción A: Crear nueva cuenta (Recomendado)**
- Ve a https://accounts.google.com/signup
- Crea: `inventarioadso2024@gmail.com` (o el nombre que prefieras)

**Opción B: Usar cuenta existente**
- Usa tu cuenta actual de Gmail

### 2. 🔐 Activar Verificación en 2 Pasos

1. Ve a https://myaccount.google.com/
2. Clic en **"Seguridad"** (panel izquierdo)
3. En **"Iniciar sesión en Google"**, busca **"Verificación en 2 pasos"**
4. Clic en **"Verificación en 2 pasos"**
5. Sigue las instrucciones para activarla (necesitas tu teléfono)

### 3. 🔑 Generar Contraseña de Aplicación

1. En la misma página de Seguridad
2. Ve a **"Contraseñas de aplicación"** (parte inferior)
3. Selecciona:
   - **Aplicación**: "Correo"
   - **Dispositivo**: "Windows Computer"
4. Clic en **"Generar"**
5. **COPIA** la contraseña de 16 caracteres (ej: `abcd efgh ijkl mnop`)
6. **GUARDA** esta contraseña, la necesitarás para la configuración

---

## ⚙️ CONFIGURACIÓN EN LA APLICACIÓN

### Editar application.properties

Abre: `BACK/src/main/resources/application.properties`

Busca estas líneas y cámbialas:
```properties
# ANTES:
spring.mail.username=inventarioadso2024@gmail.com
spring.mail.password=CAMBIAR_POR_PASSWORD_APLICACION
app.notification.from-email=inventarioadso2024@gmail.com

# DESPUÉS:
spring.mail.username=tu_correo@gmail.com
spring.mail.password=abcd efgh ijkl mnop
app.notification.from-email=tu_correo@gmail.com
```

**⚠️ IMPORTANTE**: Usa la contraseña de aplicación de 16 caracteres, NO tu contraseña normal de Gmail.

---

## 🧪 PROBAR LA CONFIGURACIÓN

### 1. Iniciar la Aplicación
```bash
cd BACK
mvnw spring-boot:run
```

### 2. Probar Correo Básico
Abre en tu navegador:
```
http://localhost:8080/api/test/email
```

**Resultado esperado**: 
- Deberías recibir un correo en `jc2583@gmail.com` con el asunto "🧪 Prueba de Configuración"

### 3. Probar Notificaciones Completas

**Prueba de Acceso:**
```
http://localhost:8080/api/test/notificacion-acceso
```

**Prueba de Modificación:**
```
http://localhost:8080/api/test/notificacion-modificacion
```

**Prueba de Descarga:**
```
http://localhost:8080/api/test/notificacion-descarga
```

**Ver Estado del Sistema:**
```
http://localhost:8080/api/test/status
```

---

## 🎯 VERIFICAR QUE FUNCIONA EN PRODUCCIÓN

### 1. Probar Acceso Automático
- Ve a `http://localhost:8080/`
- Deberías recibir una notificación automática de acceso

### 2. Probar Descarga de Excel
- Ve a `http://localhost:8080/api/inventario/descargar-excel`
- Deberías recibir una notificación de descarga

### 3. Probar Subida de Archivo
- Sube un archivo Excel desde el frontend
- Deberías recibir una notificación de subida

---

## ✅ CONFIRMACIÓN DE FUNCIONAMIENTO

Deberías recibir correos para:

### 🔔 **Accesos** (Automático)
- Cada vez que alguien visita las páginas principales
- Cada vez que se accede a las APIs del inventario

### ⚠️ **Modificaciones**
- Actualización del inventario
- Subida de archivos Excel
- Comparación de archivos

### 📥 **Descargas**
- Descarga del inventario completo
- Descarga de reportes de diferencias

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Authentication failed"
**Solución**: Verifica que estés usando la contraseña de aplicación de 16 caracteres, no tu contraseña normal.

### ❌ Error: "Username and Password not accepted"
**Solución**: 
1. Verifica que la verificación en 2 pasos esté activa
2. Regenera la contraseña de aplicación
3. Verifica que el email sea correcto

### ❌ No llegan los correos
**Solución**:
1. Revisa la carpeta de spam/correo no deseado
2. Verifica que el email destino sea `jc2583@gmail.com`
3. Verifica los logs de la aplicación

### ❌ Error de conexión
**Solución**:
1. Verifica tu conexión a internet
2. Verifica que el puerto 587 no esté bloqueado por firewall
3. Prueba con otro proveedor de email si es necesario

---

## 🎉 ¡LISTO!

Una vez configurado, el sistema enviará automáticamente notificaciones a `jc2583@gmail.com` para:

- **Cada visita** a la página
- **Cada modificación** al inventario  
- **Cada descarga** de archivos Excel

**¡No necesitas hacer nada más! El sistema funciona automáticamente.** 🚀