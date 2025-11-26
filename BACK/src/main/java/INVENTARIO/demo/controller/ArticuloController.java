package INVENTARIO.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import INVENTARIO.demo.model.Articulo;
import INVENTARIO.demo.repository.ArticuloRepository;
import INVENTARIO.demo.service.NotificationService;
import INVENTARIO.demo.service.PdfExportService;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

    @Autowired
    private ArticuloRepository articuloRepository;
    
    @Autowired
    private PdfExportService pdfExportService;
    
    @Autowired
    private NotificationService notificationService;

    // Obtener todos los artículos
    @GetMapping
    public ResponseEntity<List<Articulo>> getAllArticulos() {
        return new ResponseEntity<>(articuloRepository.findAll(), HttpStatus.OK);
    }

    // Obtener un artículo por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getArticuloById(@PathVariable String id) {
        if ("new".equals(id)) {
            // Lógica para manejar el caso especial "new"
            return ResponseEntity.ok("Creando un nuevo artículo...");
        }

        try {
            Long articuloId = Long.parseLong(id);
            Optional<Articulo> articulo = articuloRepository.findById(articuloId);
            return articulo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("El ID proporcionado no es válido.");
        }
    }

    // Crear un nuevo artículo
    @PostMapping
    public ResponseEntity<Articulo> createArticulo(@RequestBody Articulo articulo) {
        Articulo newArticulo = articuloRepository.save(articulo);
        return new ResponseEntity<>(newArticulo, HttpStatus.CREATED);
    }

    // Actualizar un artículo existente
    @PutMapping("/{id}")
    public ResponseEntity<Articulo> updateArticulo(@PathVariable Long id, @RequestBody Articulo articuloDetails) {
        Optional<Articulo> optionalArticulo = articuloRepository.findById(id);
        if (optionalArticulo.isPresent()) {
            Articulo existingArticulo = optionalArticulo.get();
            existingArticulo.setCodigoArticulo(articuloDetails.getCodigoArticulo());
            existingArticulo.setDescripcion(articuloDetails.getDescripcion());
            existingArticulo.setCantidadTeorica(articuloDetails.getCantidadTeorica());
            existingArticulo.setPlaca(articuloDetails.getPlaca());
            existingArticulo.setObservaciones(articuloDetails.getObservaciones());
            existingArticulo.setEstado(articuloDetails.getEstado());
            existingArticulo.setClasificacion(articuloDetails.getClasificacion());
            existingArticulo.setUbicacion(articuloDetails.getUbicacion());

            return new ResponseEntity<>(articuloRepository.save(existingArticulo), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un artículo por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteArticulo(@PathVariable Long id) {
        try {
            articuloRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Buscar un artículo por placa
    @GetMapping("/buscar/{placa}")
    public ResponseEntity<?> getArticuloByPlaca(@PathVariable String placa) {
        List<Articulo> articulos = articuloRepository.findByPlaca(placa);
        if (articulos.isEmpty()) {
            return new ResponseEntity<>("No se encontró ningún artículo con la placa proporcionada.", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(articulos, HttpStatus.OK);
    }

    // ========== NUEVAS FUNCIONALIDADES ==========



    // 🔍 Búsqueda inteligente por descripción
    @GetMapping("/busqueda")
    public ResponseEntity<List<Articulo>> busquedaInteligente(@RequestParam String q, HttpServletRequest request) {
        try {
            List<Articulo> resultados = articuloRepository.busquedaInteligente(q);
            
            // Notificar búsqueda
            notificationService.notificarAccesoUsuario(
                request.getRemoteAddr(), 
                "Búsqueda inteligente: " + q + " (resultados: " + resultados.size() + ")", 
                "/api/articulos/busqueda"
            );
            
            return new ResponseEntity<>(resultados, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 🔍 Búsqueda avanzada con múltiples criterios
    @GetMapping("/busqueda-avanzada")
    public ResponseEntity<List<Articulo>> busquedaAvanzada(
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String clasificacion,
            @RequestParam(required = false) String ubicacion,
            HttpServletRequest request) {
        try {
            List<Articulo> resultados = articuloRepository.busquedaAvanzada(descripcion, estado, clasificacion, ubicacion);
            
            // Notificar búsqueda avanzada
            String criterios = String.format("desc:%s, estado:%s, clas:%s, ubi:%s", 
                descripcion != null ? descripcion : "null",
                estado != null ? estado : "null",
                clasificacion != null ? clasificacion : "null",
                ubicacion != null ? ubicacion : "null"
            );
            
            notificationService.notificarAccesoUsuario(
                request.getRemoteAddr(), 
                "Búsqueda avanzada (" + criterios + ") - resultados: " + resultados.size(), 
                "/api/articulos/busqueda-avanzada"
            );
            
            return new ResponseEntity<>(resultados, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 📄 Exportar artículos a PDF
    @GetMapping("/exportar/pdf")
    public ResponseEntity<byte[]> exportarPDF(
            @RequestParam(required = false) String filtro,
            HttpServletRequest request) {
        try {
            List<Articulo> articulos;
            
            // Aplicar filtro si se proporciona
            if (filtro != null && !filtro.trim().isEmpty()) {
                articulos = articuloRepository.busquedaInteligente(filtro);
            } else {
                articulos = articuloRepository.findAll();
            }
            
            byte[] pdfBytes = pdfExportService.exportarArticulosPDF(articulos);
            
            // Notificar descarga de PDF
            notificationService.notificarDescargaExcel(
                request.getRemoteAddr(), 
                "Exportación PDF", 
                "inventario_" + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".pdf"
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "inventario_articulos.pdf");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 📊 Obtener estadísticas para dashboard
    @GetMapping("/estadisticas")
    public ResponseEntity<?> getEstadisticas(HttpServletRequest request) {
        try {
            List<Articulo> todosArticulos = articuloRepository.findAll();
            
            // Calcular estadísticas
            long totalArticulos = todosArticulos.size();
            long articulosActivos = todosArticulos.stream().filter(a -> "ACTIVO".equalsIgnoreCase(a.getEstado())).count();
            long articulosInactivos = todosArticulos.stream().filter(a -> "INACTIVO".equalsIgnoreCase(a.getEstado())).count();
            
            // Crear respuesta con estadísticas
            var estadisticas = new java.util.HashMap<String, Object>();
            estadisticas.put("total", totalArticulos);
            estadisticas.put("activos", articulosActivos);
            estadisticas.put("inactivos", articulosInactivos);
            estadisticas.put("porcentajeActivos", totalArticulos > 0 ? (articulosActivos * 100.0 / totalArticulos) : 0);
            
            // Notificar consulta de estadísticas
            notificationService.notificarAccesoUsuario(
                request.getRemoteAddr(), 
                "Consulta de estadísticas - Total: " + totalArticulos, 
                "/api/articulos/estadisticas"
            );
            
            return new ResponseEntity<>(estadisticas, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}