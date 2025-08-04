package INVENTARIO.demo;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controlador principal para las vistas web de la aplicación
 */
@Controller
public class DemoController {

    /**
     * Página principal con Thymeleaf
     * Accesible en: http://localhost:8080/hello
     */
    @GetMapping("/hello")
    public String greeting(
            @RequestParam(name="nombre", required=false, defaultValue="Coordinador ADSO") String name, 
            Model model) {
        
        model.addAttribute("nombre", name);
        return "hello"; // Retorna el archivo hello.html
    }

    /**
     * Página de inicio (root)
     * Redirige a /hello
     */
    @GetMapping("/")
    public String home() {
        return "redirect:/hello?nombre=Administrador SENA";
    }

    /**
     * Endpoint de estado de la aplicación
     * Devuelve información sobre el estado del sistema
     */
    @GetMapping("/status")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Sistema de Inventario ADSO - SENA funcionando correctamente");
        status.put("port", "8080");
        status.put("timestamp", System.currentTimeMillis());
        status.put("organization", "SENA - Servicio Nacional de Aprendizaje");
        status.put("program", "Análisis y Desarrollo de Software (ADSO)");
        status.put("services", Map.of(
            "backend", "Spring Boot - RUNNING",
            "database", "PostgreSQL - CONNECTED", 
            "api", "REST Endpoints - AVAILABLE",
            "frontend", "Next.js - http://localhost:3000",
            "coordination", "ADSO - ACTIVE"
        ));
        
        return ResponseEntity.ok(status);
    }

    /**
     * Página de prueba para diferentes usuarios
     */
    @GetMapping("/dashboard")
    public String dashboard(
            @RequestParam(name="role", required=false, defaultValue="user") String role,
            Model model) {
        
        model.addAttribute("nombre", role.equals("admin") ? "Administrador" : "Usuario");
        model.addAttribute("role", role);
        return "hello";
    }
}
