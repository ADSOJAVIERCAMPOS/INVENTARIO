package INVENTARIO.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import INVENTARIO.demo.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Controlador para probar el sistema de notificaciones por correo
 */
@RestController
@RequestMapping("/api/test-mail")
@CrossOrigin(origins = "*")
public class MailTestController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Endpoint para probar el envío de correos
     */
    @GetMapping("/send")
    public ResponseEntity<Map<String, Object>> testSendEmail(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String clientIp = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            // Enviar notificación de prueba
            notificationService.notificarAccesoUsuario(clientIp, userAgent, "/api/test-mail/send");
            
            response.put("success", true);
            response.put("message", "✅ Correo de prueba enviado exitosamente!");
            response.put("recipient", "jc2583@gmail.com");
            response.put("from_ip", clientIp);
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "❌ Error al enviar correo: " + e.getMessage());
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Endpoint para probar notificación de modificación
     */
    @PostMapping("/modification")
    public ResponseEntity<Map<String, Object>> testModificationNotification(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String clientIp = getClientIpAddress(request);
            
            notificationService.notificarModificacion(clientIp, "Prueba de modificación", "Test desde controlador de prueba");
            
            response.put("success", true);
            response.put("message", "✅ Notificación de modificación enviada!");
            response.put("recipient", "jc2583@gmail.com");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "❌ Error: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Endpoint para probar notificación de descarga
     */
    @GetMapping("/download")
    public ResponseEntity<Map<String, Object>> testDownloadNotification(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String clientIp = getClientIpAddress(request);
            
            notificationService.notificarDescargaExcel(clientIp, "Prueba de descarga", "reporte_prueba.xlsx");
            
            response.put("success", true);
            response.put("message", "✅ Notificación de descarga enviada!");
            response.put("file", "reporte_prueba.xlsx");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "❌ Error: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Endpoint para verificar la configuración del correo
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getMailConfig() {
        Map<String, Object> response = new HashMap<>();
        
        response.put("mail_service_available", notificationService != null);
        response.put("notification_email", "jc2583@gmail.com");
        response.put("smtp_host", "smtp.gmail.com");
        response.put("smtp_port", 587);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener la IP del cliente
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}