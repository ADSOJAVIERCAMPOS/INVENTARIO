package INVENTARIO.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        
        System.out.println("========================================");
        System.out.println("    🚀 SISTEMA DE INVENTARIO INICIADO");
        System.out.println("========================================");
        System.out.println();
        System.out.println("🌐 Aplicación disponible en:");
        System.out.println("   http://localhost:8080/");
        System.out.println("   http://localhost:8080/hello");
        System.out.println("   http://localhost:8080/inventario");
        System.out.println("   http://localhost:8080/api/articulos");
        System.out.println();
        System.out.println("📋 Funcionalidades:");
        System.out.println("   ✅ Vistas Thymeleaf funcionando");
        System.out.println("   ✅ API REST disponible");
        System.out.println("   ✅ Base de datos conectada");
        System.out.println("   ⚠️ Autenticación temporalmente deshabilitada");
        System.out.println();
        System.out.println("🎯 Acceso directo sin login requerido");
        System.out.println("========================================");
    }
}