package INVENTARIO.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import INVENTARIO.demo.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/email")
    public ResponseEntity<Map<String, Object>> probarCorreo(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean enviado = notificationService.probarConexionCorreo();
            
            if (enviado) {
                response.put("success", true);
                response.put("message", "✅ Correo de prueba enviado exitosamente a jc2583@gmail.com");
                response.put("details", "Revisa tu bandeja de entrada y spam");
            } else {
                response.put("success", false);
                response.put("message", "❌ Error enviando correo de prueba");
                response.put("details", "Revisa la configuración del correo y los logs");
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "❌ Error: " + e.getMessage());
            response.put("details", "Revisa la configuración del correo en application.properties");
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/notificacion-acceso")
    public ResponseEntity<Map<String, Object>> probarNotificacionAcceso(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            // Enviar notificación de prueba
            new Thread(() -> {
                notificationService.notificarAccesoUsuario(ipAddress, userAgent, "/api/test/notificacion-acceso [PRUEBA]");
            }).start();
            
            response.put("success", true);
            response.put("message", "🔔 Notificación de acceso enviada");
            response.put("ip", ipAddress);
            response.put("userAgent", userAgent);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "❌ Error: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/notificacion-modificacion")
    public ResponseEntity<Map<String, Object>> probarNotificacionModificacion(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String ipAddress = getClientIpAddress(request);
            
            // Enviar notificación de modificación de prueba
            new Thread(() -> {
                notificationService.notificarModificacion(
                    ipAddress, 
                    "Prueba de Sistema", 
                    "Esta es una prueba del sistema de notificaciones para modificaciones"
                );
            }).start();
            
            response.put("success", true);
            response.put("message", "⚠️ Notificación de modificación enviada");
            response.put("ip", ipAddress);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "❌ Error: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/notificacion-descarga")
    public ResponseEntity<Map<String, Object>> probarNotificacionDescarga(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String ipAddress = getClientIpAddress(request);
            
            // Enviar notificación de descarga de prueba
            new Thread(() -> {
                notificationService.notificarDescargaExcel(
                    ipAddress, 
                    "Prueba de Descarga", 
                    "ArchivoTEST.xlsx"
                );
            }).start();
            
            response.put("success", true);
            response.put("message", "📥 Notificación de descarga enviada");
            response.put("ip", ipAddress);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "❌ Error: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> obtenerEstado() {
        Map<String, Object> response = new HashMap<>();
        
        response.put("sistema", "Sistema de Notificaciones - Inventario ADSO");
        response.put("correo_destino", "jc2583@gmail.com");
        response.put("estado", "Activo");
        response.put("endpoints_disponibles", new String[]{
            "GET /api/test/email - Probar configuración de correo",
            "GET /api/test/notificacion-acceso - Probar notificación de acceso",
            "GET /api/test/notificacion-modificacion - Probar notificación de modificación", 
            "GET /api/test/notificacion-descarga - Probar notificación de descarga",
            "GET /api/inventario/descargar-excel - Descargar inventario (con notificación)",
            "GET /api/reportes/exportar-diferencias - Exportar diferencias (con notificación)"
        });
        
        return ResponseEntity.ok(response);
    }

    // Método para obtener la IP del cliente
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }
}