# 📋 Instrucciones para Configurar Vistas en Spring Boot

## 🎯 Objetivo
Crear vistas web para tu aplicación Spring Boot y deshabilitar la advertencia `spring.jpa.open-in-view`.

## 📁 Archivos a Copiar

### 1. **application.properties**
📍 **Ubicación:** `src/main/resources/application.properties`

Copia el contenido de `backend-files/application.properties` a tu proyecto backend.

**Características:**
- ✅ Deshabilitada la advertencia `spring.jpa.open-in-view=false`
- 🎨 Configuración de Thymeleaf
- 🌐 Configuración CORS para el frontend
- 🔗 Configuración de base de datos PostgreSQL

### 2. **hello.html**
📍 **Ubicación:** `src/main/resources/templates/hello.html`

Crea la carpeta `templates` si no existe y copia el archivo HTML.

**Características:**
- 🎨 Diseño moderno con Bootstrap 5
- 📱 Responsive design
- 🔗 Enlaces al frontend y API
- 📊 Dashboard de estado del sistema

### 3. **DemoController.java**
📍 **Ubicación:** `src/main/java/INVENTARIO/demo/DemoController.java`

**Endpoints disponibles:**
- `GET /` - Redirige a la página principal
- `GET /hello` - Página principal con parámetro nombre
- `GET /dashboard` - Dashboard con roles
- `GET /status` - Estado del sistema (JSON)

### 4. **CorsConfig.java**
📍 **Ubicación:** `src/main/java/INVENTARIO/demo/config/CorsConfig.java`

Crea la carpeta `config` dentro del paquete principal si no existe.

## 🚀 Pasos de Instalación

### Paso 1: Crear estructura de carpetas
```bash
cd c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK
mkdir src\main\resources\templates
mkdir src\main\java\INVENTARIO\demo\config
```

### Paso 2: Copiar archivos de configuración
1. Copia `backend-files/application.properties` → `src/main/resources/application.properties`
2. Copia `backend-files/hello.html` → `src/main/resources/templates/hello.html`

### Paso 3: Copiar archivos Java
1. Copia `backend-files/DemoController.java` → `src/main/java/INVENTARIO/demo/DemoController.java`
2. Copia `backend-files/CorsConfig.java` → `src/main/java/INVENTARIO/demo/config/CorsConfig.java`

### Paso 4: Verificar dependencias en pom.xml
Asegúrate de que estas dependencias estén en tu `pom.xml`:

```xml
<!-- Thymeleaf para vistas -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- Web starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### Paso 5: Reiniciar la aplicación
```bash
mvn spring-boot:run
```

## 🌐 URLs Disponibles

Después de la instalación, podrás acceder a:

| URL | Descripción |
|-----|-------------|
| `http://localhost:8080/` | Página principal (redirige a /hello) |
| `http://localhost:8080/hello` | Vista principal |
| `http://localhost:8080/hello?nombre=TuNombre` | Vista con nombre personalizado |
| `http://localhost:8080/dashboard?role=admin` | Dashboard de administrador |
| `http://localhost:8080/status` | Estado del sistema (JSON) |
| `http://localhost:8080/api/inventario` | API REST del inventario |

## ✅ Verificación

1. **Advertencia eliminada:** Ya no verás el mensaje sobre `spring.jpa.open-in-view`
2. **Vistas funcionando:** Podrás ver la página web en `http://localhost:8080/hello`
3. **CORS configurado:** El frontend podrá conectarse sin problemas
4. **API disponible:** Los endpoints REST seguirán funcionando

## 🎨 Personalización

### Cambiar el diseño
Edita `src/main/resources/templates/hello.html` para personalizar:
- Colores y estilos CSS
- Contenido de las secciones
- Enlaces y navegación

### Agregar más vistas
Crea nuevos archivos HTML en `templates/` y agrega métodos en `DemoController.java`

### Configurar base de datos
Modifica `application.properties` con tus credenciales de PostgreSQL

## 🔧 Solución de Problemas

### Error: "templates not found"
- Verifica que la carpeta `src/main/resources/templates/` existe
- Asegúrate de que `hello.html` está en esa carpeta

### Error: CORS
- Verifica que `CorsConfig.java` está en el paquete correcto
- Reinicia la aplicación Spring Boot

### Error: Puerto ocupado
- Verifica que solo una instancia de Spring Boot está corriendo
- Usa `taskkill /F /IM java.exe` si es necesario

## 🎯 Resultado Final

Tendrás una aplicación Spring Boot completa con:
- ✅ Backend API REST funcionando
- ✅ Vistas web con Thymeleaf
- ✅ Frontend Next.js conectado
- ✅ Configuración CORS adecuada
- ✅ Sin advertencias de configuración
