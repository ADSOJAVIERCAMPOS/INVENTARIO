package INVENTARIO.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.notification.email}")
    private String notificationEmail;

    @Value("${app.notification.from-email}")
    private String fromEmail;

    @Value("${app.notification.enabled:true}")
    private boolean notificationsEnabled;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public void notificarAccesoUsuario(String ipAddress, String userAgent, String endpoint) {
        if (!notificationsEnabled) return;
        
        try {
            logger.info("Enviando notificación de acceso a: {} desde IP: {}", endpoint, ipAddress);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(notificationEmail);
            message.setFrom(fromEmail);
            message.setSubject("🔔 Acceso al Sistema de Inventario ADSO");
            
            String texto = String.format(
                "Se ha registrado un acceso al sistema de inventario:\n\n" +
                "⏰ Fecha y Hora: %s\n" +
                "🌐 Dirección IP: %s\n" +
                "📱 Navegador/Dispositivo: %s\n" +
                "📄 Página accedida: %s\n\n" +
                "Sistema de Monitoreo Automático - INVENTARIO ADSO",
                LocalDateTime.now().format(formatter),
                ipAddress != null ? ipAddress : "No disponible",
                userAgent != null ? userAgent : "No disponible",
                endpoint
            );
            
            message.setText(texto);
            mailSender.send(message);
            logger.info("✅ Notificación de acceso enviada exitosamente a: {}", notificationEmail);
            
        } catch (Exception e) {
            logger.error("❌ Error enviando notificación de acceso: {}", e.getMessage(), e);
        }
    }

    public void notificarModificacion(String ipAddress, String tipoModificacion, String detalles) {
        if (!notificationsEnabled) return;
        
        try {
            logger.info("Enviando notificación de modificación: {} desde IP: {}", tipoModificacion, ipAddress);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(notificationEmail);
            message.setFrom(fromEmail);
            message.setSubject("⚠️ Modificación en Sistema de Inventario ADSO");
            
            String texto = String.format(
                "Se ha realizado una modificación en el sistema de inventario:\n\n" +
                "⏰ Fecha y Hora: %s\n" +
                "🌐 Dirección IP: %s\n" +
                "🔄 Tipo de Modificación: %s\n" +
                "📝 Detalles: %s\n\n" +
                "Sistema de Monitoreo Automático - INVENTARIO ADSO",
                LocalDateTime.now().format(formatter),
                ipAddress != null ? ipAddress : "No disponible",
                tipoModificacion,
                detalles
            );
            
            message.setText(texto);
            mailSender.send(message);
            logger.info("✅ Notificación de modificación enviada exitosamente a: {}", notificationEmail);
            
        } catch (Exception e) {
            logger.error("❌ Error enviando notificación de modificación: {}", e.getMessage(), e);
        }
    }

    public void notificarDescargaExcel(String ipAddress, String tipoDescarga, String nombreArchivo) {
        if (!notificationsEnabled) return;
        
        try {
            logger.info("Enviando notificación de descarga: {} desde IP: {}", tipoDescarga, ipAddress);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(notificationEmail);
            message.setFrom(fromEmail);
            message.setSubject("📥 Descarga de Excel - Sistema de Inventario ADSO");
            
            String texto = String.format(
                "Se ha realizado una descarga de archivo Excel:\n\n" +
                "⏰ Fecha y Hora: %s\n" +
                "🌐 Dirección IP: %s\n" +
                "📊 Tipo de Descarga: %s\n" +
                "📄 Archivo: %s\n\n" +
                "Sistema de Monitoreo Automático - INVENTARIO ADSO",
                LocalDateTime.now().format(formatter),
                ipAddress != null ? ipAddress : "No disponible",
                tipoDescarga,
                nombreArchivo != null ? nombreArchivo : "Inventario.xlsx"
            );
            
            message.setText(texto);
            mailSender.send(message);
            logger.info("✅ Notificación de descarga enviada exitosamente a: {}", notificationEmail);
            
        } catch (Exception e) {
            logger.error("❌ Error enviando notificación de descarga: {}", e.getMessage(), e);
        }
    }

    public void notificarSubidaArchivo(String ipAddress, String nombreArchivo, int cantidadElementos) {
        if (!notificationsEnabled) return;
        
        try {
            logger.info("Enviando notificación de subida: {} ({} elementos) desde IP: {}", nombreArchivo, cantidadElementos, ipAddress);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(notificationEmail);
            message.setFrom(fromEmail);
            message.setSubject("📤 Subida de Archivo - Sistema de Inventario ADSO");
            
            String texto = String.format(
                "Se ha subido un nuevo archivo al sistema:\n\n" +
                "⏰ Fecha y Hora: %s\n" +
                "🌐 Dirección IP: %s\n" +
                "📄 Archivo subido: %s\n" +
                "📊 Elementos procesados: %d\n\n" +
                "Sistema de Monitoreo Automático - INVENTARIO ADSO",
                LocalDateTime.now().format(formatter),
                ipAddress != null ? ipAddress : "No disponible",
                nombreArchivo,
                cantidadElementos
            );
            
            
            message.setText(texto);
            mailSender.send(message);
            logger.info("✅ Notificación de subida enviada exitosamente a: {}", notificationEmail);
            
        } catch (Exception e) {
            logger.error("❌ Error enviando notificación de subida: {}", e.getMessage(), e);
        }
    }
    
    // Método para probar la configuración de correo
    public boolean probarConexionCorreo() {
        try {
            logger.info("Probando configuración de correo...");
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(notificationEmail);
            message.setFrom(fromEmail);
            message.setSubject("🧪 Prueba de Configuración - Sistema de Inventario ADSO");
            message.setText(
                "Este es un mensaje de prueba para verificar que el sistema de notificaciones está funcionando correctamente.\n\n" +
                "⏰ Fecha y Hora: " + LocalDateTime.now().format(formatter) + "\n" +
                "✅ Si recibes este correo, el sistema está configurado correctamente.\n\n" +
                "Sistema de Monitoreo Automático - INVENTARIO ADSO"
            );
            
            mailSender.send(message);
            logger.info("✅ Correo de prueba enviado exitosamente a: {}", notificationEmail);
            return true;
            
        } catch (Exception e) {
            logger.error("❌ Error en prueba de correo: {}", e.getMessage(), e);
            return false;
        }
    }
}