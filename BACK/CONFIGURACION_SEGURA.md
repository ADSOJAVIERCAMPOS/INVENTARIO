# 🔒 CONFIGURACIÓN SEGURA DE VARIABLES DE ENTORNO

## ⚠️ IMPORTANTE: SEGURIDAD DE CREDENCIALES

Las credenciales de correo y base de datos NO deben estar en el código fuente por seguridad.

## 🛠️ CONFIGURACIÓN PARA DESARROLLO LOCAL:

### 1. Crear archivo `.env` en BACK/:
```env
MAIL_USERNAME=jc2583@gmail.com
MAIL_PASSWORD=sbxi ioio vdrq tkhj
NOTIFICATION_EMAIL=jc2583@gmail.com
```

### 2. El archivo `.env` está en .gitignore y NO se sube al repositorio.

## 🌐 CONFIGURACIÓN PARA PRODUCCIÓN (VERCEL):

### Variables de entorno en Vercel Dashboard:
```
MAIL_USERNAME=jc2583@gmail.com
MAIL_PASSWORD=sbxi ioio vdrq tkhj
NOTIFICATION_EMAIL=jc2583@gmail.com
```

### Cómo configurar en Vercel:
1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto INVENTARIO
3. Ve a Settings → Environment Variables
4. Agrega cada variable:
   - Name: `MAIL_USERNAME`, Value: `jc2583@gmail.com`
   - Name: `MAIL_PASSWORD`, Value: `sbxi ioio vdrq tkhj`
   - Name: `NOTIFICATION_EMAIL`, Value: `jc2583@gmail.com`

## 🔧 CONFIGURACIÓN PARA DESARROLLO:

### Opción A: Usar archivo .env
El archivo `.env` se carga automáticamente en desarrollo.

### Opción B: Variables de entorno del sistema
```bash
# Windows
set MAIL_USERNAME=jc2583@gmail.com
set MAIL_PASSWORD=sbxi ioio vdrq tkhj
set NOTIFICATION_EMAIL=jc2583@gmail.com

# Linux/Mac
export MAIL_USERNAME=jc2583@gmail.com
export MAIL_PASSWORD=sbxi ioio vdrq tkhj
export NOTIFICATION_EMAIL=jc2583@gmail.com
```

## ✅ VERIFICAR CONFIGURACIÓN:

Una vez configuradas las variables de entorno, ejecutar:
```bash
mvnw spring-boot:run
```

El sistema usará las variables de entorno automáticamente.

## 🔐 BUENAS PRÁCTICAS:

✅ **NUNCA** subir contraseñas al repositorio  
✅ **SIEMPRE** usar variables de entorno para datos sensibles  
✅ **INCLUIR** archivos .env en .gitignore  
✅ **DOCUMENTAR** las variables requeridas  
✅ **REGENERAR** contraseñas si se exponen  

## 🆘 SI SE EXPONEN CREDENCIALES:

1. **Cambiar inmediatamente** la contraseña de aplicación de Gmail
2. **Regenerar** nueva contraseña de aplicación  
3. **Actualizar** variables de entorno con la nueva contraseña
4. **NO** incluir credenciales en commits futuros

¡La seguridad es prioritaria! 🔒