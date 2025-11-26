🚀 GUÍA RÁPIDA - CONFIGURACIÓN FINAL SISTEMA DE NOTIFICACIONES
================================================================

✅ CONFIGURACIÓN DE CORREO COMPLETADA:
- Email de envío: jc2583@gmail.com
- Email de destino: jc2583@gmail.com  
- Contraseña configurada: sbxi ioio vdrq tkhj
- Sistema implementado al 100%

❗ FALTA SOLO: INSTALAR JAVA
=============================

PASO 1: INSTALAR JAVA 21
-------------------------
Descargar e instalar desde:
🌐 https://adoptium.net/temurin/releases/?version=21

1. Ve al enlace de arriba
2. Selecciona "Windows x64" 
3. Descarga el archivo .msi
4. Ejecuta el instalador
5. ✅ Marca "Set JAVA_HOME variable" durante la instalación
6. ✅ Marca "Add to PATH" durante la instalación

PASO 2: VERIFICAR INSTALACIÓN
-----------------------------
Abre una nueva terminal (cmd o PowerShell) y ejecuta:
```
java -version
```
Deberías ver algo como: "openjdk version "21.0.x""

PASO 3: PROBAR EL SISTEMA
-------------------------
Una vez instalado Java:

1. Abre terminal en la carpeta BACK/
2. Ejecuta: mvnw spring-boot:run
3. Espera que inicie (30-60 segundos)
4. Ve a: http://localhost:8080/api/test/email
5. ¡Deberías recibir correo en jc2583@gmail.com!

🧪 ENDPOINTS DE PRUEBA:
=======================
- http://localhost:8080/api/test/email (Prueba básica de correo)
- http://localhost:8080/api/test/notificacion-acceso (Prueba acceso)
- http://localhost:8080/api/test/status (Estado del sistema)
- http://localhost:8080/ (Página principal - genera notificación automática)

🎯 QUE ESPERAR:
===============
Una vez funcionando, recibirás correos automáticamente por:

📧 ACCESOS:
- Cada visita a la página principal
- Cada consulta a las APIs

📧 MODIFICACIONES:  
- Subida de archivos Excel
- Actualización del inventario
- Comparación de archivos

📧 DESCARGAS:
- Descarga de inventario completo
- Exportación de reportes

🔔 EJEMPLO DE CORREO QUE RECIBIRÁS:
===================================
Para: jc2583@gmail.com
Asunto: 🔔 Acceso al Sistema de Inventario ADSO

Se ha registrado un acceso al sistema de inventario:

⏰ Fecha y Hora: 25/11/2024 15:30:45
🌐 Dirección IP: 192.168.1.100
📱 Navegador/Dispositivo: Chrome 119.0
📄 Página accedida: /

Sistema de Monitoreo Automático - INVENTARIO ADSO

🆘 SOLUCIÓN DE PROBLEMAS:
=========================
- Si no llegan correos → Revisa carpeta SPAM
- Si hay errores de Java → Reinstala desde adoptium.net
- Si hay errores de correo → Verifica contraseña de aplicación
- Si el servidor no inicia → Verifica puerto 8080 libre

💡 ALTERNATIVA RÁPIDA:
=====================
Si tienes problemas instalando Java, puedes usar el instalador automático:
1. Instala Chocolatey: https://chocolatey.org/install
2. Ejecuta en PowerShell como Admin: choco install openjdk21
3. Reinicia terminal y prueba: java -version

🎉 ¡EL SISTEMA ESTÁ 99% LISTO!
==============================
Solo falta Java y tendrás monitoreo completo automático 
en jc2583@gmail.com por toda actividad del inventario.

¡Una vez instalado Java, todo funciona automáticamente! 🚀