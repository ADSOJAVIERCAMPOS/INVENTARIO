# Sistema de Inventario Spring Boot

## 🚀 Vistas Creadas

Se han creado las siguientes vistas para tu aplicación:

### 1. Página Principal (`/hello`)
- **Archivo**: `src/main/resources/templates/hello.html`
- **URL**: `http://localhost:8080/hello`
- **Descripción**: Página de bienvenida con saludo personalizable

### 2. Panel de Inventario (`/inventario`)
- **Archivo**: `src/main/resources/templates/inventario.html`
- **URL**: `http://localhost:8080/inventario`
- **Descripción**: Panel de control para gestión de inventario

### 3. Página de Inicio (`/`)
- **URL**: `http://localhost:8080/`
- **Descripción**: Redirige a la página principal con usuario por defecto

## 📋 Controladores Creados

### DemoController.java
Ubicado en: `src/main/java/INVENTARIO/demo/controller/DemoController.java`

**Endpoints disponibles:**
- `GET /` - Página de inicio
- `GET /hello` - Saludo personalizable (parámetro: nombre)
- `GET /inventario` - Panel de inventario

## ⚙️ Configuración Agregada

### application.properties
Se agregaron las siguientes configuraciones:

```properties
# Deshabilitar advertencia de open-in-view (recomendado para APIs REST)
spring.jpa.open-in-view=false

# Configuración de Thymeleaf (motor de plantillas)
spring.thymeleaf.cache=false
spring.thymeleaf.enabled=true
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
```

## 🏃‍♂️ Cómo Ejecutar la Aplicación

### Opción 1: Maven
```bash
cd "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"
mvn spring-boot:run
```

### Opción 2: VS Code Task
- Presiona `Ctrl+Shift+P`
- Busca "Tasks: Run Task"
- Selecciona "Iniciar Spring Boot"

## 🌐 URLs para Probar

Una vez que la aplicación esté ejecutándose:

1. **Página Principal**: http://localhost:8080/
2. **Saludo con nombre**: http://localhost:8080/hello?nombre=TuNombre
3. **Panel de Inventario**: http://localhost:8080/inventario
4. **API de Artículos**: http://localhost:8080/api/articulos

## 🎨 Características de las Vistas

- **Diseño Responsivo**: Las vistas se adaptan a diferentes tamaños de pantalla
- **Estilos CSS**: Diseño moderno con Bootstrap-like styling
- **Navegación**: Enlaces entre las diferentes secciones
- **Integración Thymeleaf**: Uso de variables dinámicas desde el controlador

## ✅ Problemas Resueltos

1. **Advertencia `spring.jpa.open-in-view`**: Deshabilitada para mejorar rendimiento
2. **Directorio `templates/` faltante**: Creado con las vistas correspondientes
3. **Motor de plantillas**: Thymeleaf configurado y funcionando
4. **Controladores de vista**: Separados de la API REST

## 🔧 Próximos Pasos

1. Ejecuta la aplicación con `mvn spring-boot:run`
2. Visita http://localhost:8080/ para ver la página principal
3. Prueba los diferentes endpoints
4. Personaliza las vistas según tus necesidades

## 📚 Estructura de Archivos Agregados

```
src/
├── main/
│   ├── java/INVENTARIO/demo/controller/
│   │   └── DemoController.java          # ✅ Nuevo
│   └── resources/
│       ├── templates/                   # ✅ Nuevo directorio
│       │   ├── hello.html              # ✅ Nueva vista
│       │   └── inventario.html         # ✅ Nueva vista
│       └── application.properties       # ✅ Actualizado
└── .vscode/
    └── tasks.json                       # ✅ Actualizado
```

¡Ya puedes ejecutar tu aplicación y ver las vistas funcionando! 🎉
