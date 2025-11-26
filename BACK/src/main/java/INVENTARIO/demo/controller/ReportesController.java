package INVENTARIO.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import INVENTARIO.demo.service.ExcelService;
import INVENTARIO.demo.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/reportes")
public class ReportesController {

    @Autowired
    private ExcelService excelService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/exportar-diferencias")
    public ResponseEntity<Resource> exportarDiferencias(HttpServletRequest request) {
        try {
            Resource resource = excelService.exportarDiferenciasAExcel();
            
            // Notificar descarga
            String ipAddress = getClientIpAddress(request);
            notificationService.notificarDescargaExcel(ipAddress, "Reporte de Diferencias", "DiferenciasInventario.xlsx");
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"DiferenciasInventario.xlsx\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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