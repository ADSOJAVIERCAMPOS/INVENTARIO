package INVENTARIO.demo.service;

import INVENTARIO.demo.model.Articulo;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfExportService {

    public byte[] exportarArticulosPDF(List<Articulo> articulos) throws Exception {
        // Crear HTML que se convertirá a PDF en el frontend
        String htmlContent = generarHtmlParaPdf(articulos);
        
        // Devolvemos el HTML como bytes para que el frontend lo maneje
        return htmlContent.getBytes("UTF-8");
    }
    
    private String generarHtmlParaPdf(List<Articulo> articulos) {
        StringBuilder html = new StringBuilder();
        
        String fechaActual = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
        
        html.append("<!DOCTYPE html>");
        html.append("<html><head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<title>Inventario ADSO - Reporte</title>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }");
        html.append("h1 { color: #2563eb; text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 10px; }");
        html.append("h2 { color: #666; font-size: 14px; text-align: center; margin-bottom: 20px; }");
        html.append("table { width: 100%; border-collapse: collapse; margin-top: 20px; }");
        html.append("th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 11px; }");
        html.append("th { background-color: #f3f4f6; font-weight: bold; color: #374151; }");
        html.append("tr:nth-child(even) { background-color: #f9fafb; }");
        html.append("tr:hover { background-color: #e5f3ff; }");
        html.append(".summary { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 15px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #10b981; }");
        html.append(".footer { margin-top: 30px; text-align: center; font-size: 10px; color: #6b7280; border-top: 1px solid #d1d5db; padding-top: 15px; }");
        html.append(".estado-activo { color: #059669; font-weight: bold; }");
        html.append(".estado-inactivo { color: #dc2626; font-weight: bold; }");
        html.append("</style>");
        html.append("</head><body>");
        
        // Título y header
        html.append("<h1>📦 INVENTARIO ADSO - REPORTE DE ARTÍCULOS</h1>");
        html.append("<h2>📅 Generado el: ").append(fechaActual).append("</h2>");
        
        // Resumen con estadísticas
        html.append("<div class='summary'>");
        html.append("<h3 style='margin-top: 0; color: #059669;'>📊 Resumen del Inventario</h3>");
        html.append("📦 <strong>Total de artículos:</strong> ").append(articulos.size()).append("<br>");
        
        long activos = articulos.stream().filter(a -> "ACTIVO".equalsIgnoreCase(a.getEstado())).count();
        long inactivos = articulos.stream().filter(a -> "INACTIVO".equalsIgnoreCase(a.getEstado())).count();
        long otros = articulos.size() - activos - inactivos;
        
        html.append("✅ <strong>Artículos activos:</strong> ").append(activos).append(" (")
            .append(articulos.size() > 0 ? Math.round(activos * 100.0 / articulos.size()) : 0).append("%)<br>");
        html.append("❌ <strong>Artículos inactivos:</strong> ").append(inactivos).append(" (")
            .append(articulos.size() > 0 ? Math.round(inactivos * 100.0 / articulos.size()) : 0).append("%)<br>");
        if (otros > 0) {
            html.append("⚠️ <strong>Otros estados:</strong> ").append(otros).append("<br>");
        }
        html.append("</div>");
        
        // Tabla de artículos
        html.append("<table>");
        html.append("<thead>");
        html.append("<tr>");
        html.append("<th style='width: 5%;'>🆔 ID</th>");
        html.append("<th style='width: 12%;'>🔢 Código</th>");
        html.append("<th style='width: 30%;'>📝 Descripción</th>");
        html.append("<th style='width: 8%;'>📊 Cantidad</th>");
        html.append("<th style='width: 10%;'>🏷️ Placa</th>");
        html.append("<th style='width: 10%;'>⚡ Estado</th>");
        html.append("<th style='width: 12%;'>📂 Clasificación</th>");
        html.append("<th style='width: 13%;'>📍 Ubicación</th>");
        html.append("</tr>");
        html.append("</thead>");
        html.append("<tbody>");
        
        for (Articulo articulo : articulos) {
            html.append("<tr>");
            html.append("<td style='text-align: center;'>").append(articulo.getId() != null ? articulo.getId() : "").append("</td>");
            html.append("<td><strong>").append(articulo.getCodigoArticulo() != null ? articulo.getCodigoArticulo() : "").append("</strong></td>");
            html.append("<td>").append(articulo.getDescripcion() != null ? articulo.getDescripcion() : "").append("</td>");
            html.append("<td style='text-align: center;'><strong>").append(articulo.getCantidadTeorica() != null ? articulo.getCantidadTeorica() : 0).append("</strong></td>");
            html.append("<td>").append(articulo.getPlaca() != null ? articulo.getPlaca() : "-").append("</td>");
            
            // Estado con colores
            String estado = articulo.getEstado() != null ? articulo.getEstado() : "";
            String claseEstado = "";
            if ("ACTIVO".equalsIgnoreCase(estado)) {
                claseEstado = " class='estado-activo'";
            } else if ("INACTIVO".equalsIgnoreCase(estado)) {
                claseEstado = " class='estado-inactivo'";
            }
            html.append("<td").append(claseEstado).append(">").append(estado).append("</td>");
            
            html.append("<td>").append(articulo.getClasificacion() != null ? articulo.getClasificacion() : "-").append("</td>");
            html.append("<td>").append(articulo.getUbicacion() != null ? articulo.getUbicacion() : "-").append("</td>");
            html.append("</tr>");
        }
        
        html.append("</tbody>");
        html.append("</table>");
        
        // Footer mejorado
        html.append("<div class='footer'>");
        html.append("<p><strong>🏫 Sistema de Inventario ADSO</strong></p>");
        html.append("<p>Servicio Nacional de Aprendizaje - SENA</p>");
        html.append("<p>Generado automáticamente el ").append(fechaActual).append("</p>");
        html.append("<p style='font-size: 9px; color: #9ca3af;'>Este reporte contiene información confidencial del inventario institucional</p>");
        html.append("</div>");
        
        html.append("</body></html>");
        
        return html.toString();
    }
}