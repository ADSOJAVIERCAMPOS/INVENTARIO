package INVENTARIO.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import INVENTARIO.demo.interceptor.AccessInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AccessInterceptor accessInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(accessInterceptor)
                .addPathPatterns("/**") // Interceptar todas las rutas
                .excludePathPatterns("/css/**", "/js/**", "/images/**", "/favicon.ico", "/actuator/**"); // Excluir recursos estáticos
    }
}