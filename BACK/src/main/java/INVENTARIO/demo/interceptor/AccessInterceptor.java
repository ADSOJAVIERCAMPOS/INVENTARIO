package INVENTARIO.demo.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import INVENTARIO.demo.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AccessInterceptor implements HandlerInterceptor {

    @Autowired
    private NotificationService notificationService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Obtener información del usuario
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        String endpoint = request.getRequestURI();
        String method = request.getMethod();

        // Solo notificar para accesos GET a páginas principales y POST importantes
        if (shouldNotify(endpoint, method)) {
            // Ejecutar notificación en un hilo separado para no afectar la performance
            new Thread(() -> {
                try {
                    notificationService.notificarAccesoUsuario(ipAddress, userAgent, endpoint);
                } catch (Exception e) {
                    System.err.println("Error en notificación de acceso: " + e.getMessage());
                }
            }).start();
        }

        return true;
    }

    private boolean shouldNotify(String endpoint, String method) {
        // Notificar para páginas principales y accesos a APIs importantes
        return (method.equals("GET") && (
                   endpoint.equals("/") || 
                   endpoint.equals("/index.html") || 
                   endpoint.equals("/inventario.html") ||
                   endpoint.startsWith("/api/inventario") ||
                   endpoint.contains("inventario")
               )) ||
               (method.equals("POST") && (
                   endpoint.contains("/api/inventario") ||
                   endpoint.contains("/subir-excel") ||
                   endpoint.contains("/comparar-excel")
               ));
    }

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