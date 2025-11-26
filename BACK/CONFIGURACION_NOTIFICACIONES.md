# 📧 Configuración del Sistema de Notificaciones por Correo Electrónico

## ⚙️ Configuración Inicial

Para activar las notificaciones por correo electrónico, necesitas configurar los siguientes parámetros en el archivo `application.properties`:

### 1. Configuración de Gmail

```properties
# Configuración de correo electrónico
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu.correo@gmail.com
spring.mail.password=tu-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# Correo de notificaciones
app.notification.email=jc2583@gmail.com
app.notification.from-email=tu.correo@gmail.com
```

### 2. Generar Contraseña de Aplicación para Gmail

**IMPORTANTE**: No uses tu contraseña normal de Gmail. Necesitas generar una "Contraseña de aplicación":

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Selecciona "Seguridad" en el panel izquierdo
3. En "Iniciar sesión en Google", selecciona "Verificación en 2 pasos"
4. En la parte inferior, selecciona "Contraseñas de aplicación"
5. Selecciona la aplicación y el dispositivo para los que quieres generar la contraseña
6. Sigue las instrucciones para generar la contraseña de aplicación
7. Usa esta contraseña generada en `spring.mail.password`

### 3. Reemplazar Configuración

Edita el archivo `src/main/resources/application.properties` y reemplaza:

- `tu.correo@gmail.com` por tu dirección de correo de Gmail
- `tu-app-password` por la contraseña de aplicación que generaste

## 🔔 Tipos de Notificaciones Implementadas

### 1. **Acceso a la Página** 🌐
Se enviará un correo cada vez que alguien:
- Accede a la página principal (`/`, `/index.html`)
- Accede a la página de inventario (`/inventario.html`)
- Realiza consultas a la API (`/api/inventario`)

**Información incluida:**
- Fecha y hora del acceso
- Dirección IP del usuario
- Navegador/dispositivo utilizado
- Página específica accedida

### 2. **Modificaciones al Inventario** ⚠️
Se enviará un correo cuando:
- Se actualice el inventario completo
- Se suba un nuevo archivo Excel
- Se realice una comparación de archivos

**Información incluida:**
- Fecha y hora de la modificación
- Dirección IP del usuario
- Tipo de modificación realizada
- Detalles específicos (número de elementos, nombre del archivo, etc.)

### 3. **Descargas de Archivos Excel** 📥
Se enviará un correo cuando:
- Se descargue el inventario completo
- Se descargue el reporte de diferencias
- Se exporte cualquier archivo Excel

**Información incluida:**
- Fecha y hora de la descarga
- Dirección IP del usuario
- Tipo de descarga realizada
- Nombre del archivo descargado

## 🛡️ Seguridad y Privacidad

- Las notificaciones se envían de forma asíncrona para no afectar el rendimiento
- Solo se captura información básica: IP, navegador y acciones realizadas
- No se almacena información personal sensible
- Los errores de envío de email no afectan el funcionamiento normal del sistema

## 📍 Nuevos Endpoints Disponibles

### Para Descargar Excel:
- `GET /api/inventario/descargar-excel` - Descarga el inventario completo
- `GET /api/reportes/exportar-diferencias` - Descarga reporte de diferencias

### Monitoreo Automático:
- Todos los accesos a páginas principales son monitoreados automáticamente
- Las modificaciones y descargas se notifican automáticamente

## 🚀 Activación del Sistema

1. **Configura el correo** en `application.properties` como se indicó arriba
2. **Reinicia la aplicación** para que tome los nuevos cambios
3. **Prueba el sistema** accediendo a la página - deberías recibir un correo de notificación

## ⚠️ Solución de Problemas

### Si no recibes correos:
1. Verifica que la configuración de correo esté correcta
2. Asegúrate de usar una contraseña de aplicación de Gmail (no tu contraseña normal)
3. Verifica que la verificación en 2 pasos esté activada en tu cuenta de Google
4. Revisa la carpeta de spam/correo no deseado
5. Verifica los logs de la aplicación para ver si hay errores

### Logs de depuración:
Los errores de envío de correo se muestran en la consola del servidor con el prefijo:
```
Error enviando notificación de [tipo]: [mensaje de error]
```

## 📧 Correo de Destino

Todas las notificaciones se enviarán a: **jc2583@gmail.com**

¡El sistema está listo para monitorear toda la actividad del inventario! 🎯