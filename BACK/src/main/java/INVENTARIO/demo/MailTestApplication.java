package INVENTARIO.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

/**
 * Aplicación mínima para probar solo el sistema de correo
 * Excluye la configuración de base de datos
 */
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    HibernateJpaAutoConfiguration.class
})
@ComponentScan(basePackages = {
    "INVENTARIO.demo.service",
    "INVENTARIO.demo.controller",
    "INVENTARIO.demo.config"
})
public class MailTestApplication {

    public static void main(String[] args) {
        System.setProperty("spring.profiles.active", "mailonly");
        SpringApplication.run(MailTestApplication.class, args);
    }
}