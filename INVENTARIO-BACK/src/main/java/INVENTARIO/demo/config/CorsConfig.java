package INVENTARIO.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración de CORS (Cross-Origin Resource Sharing) para la aplicación.
 * Esta clase reemplaza las propiedades obsoletas de spring.web.cors en application.properties.
 * 
 * Permite que el frontend (React/Next.js) en localhost:3000 consuma la API REST.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a todos los endpoints
                .allowedOrigins("http://localhost:3000") // Solo permite el frontend en desarrollo
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*") // Permite cualquier header
                .allowCredentials(true) // Permite cookies y autenticación
                .maxAge(3600); // Cache preflight por 1 hora
    }
}
