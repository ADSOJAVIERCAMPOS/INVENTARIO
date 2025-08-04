# 📦 Sistema de Inventario - Frontend

Este es el frontend del sistema de inventario desarrollado con Next.js, que permite gestionar archivos Excel e interactuar con el backend de Spring Boot.

## 🚀 Características

- **📁 Importación de Excel**: Carga archivos .xlsx/.xls con datos de inventario
- **📤 Sincronización**: Envía y recibe datos del servidor backend
- **📊 Exportación**: Descarga reportes en formato Excel
- **📈 Estadísticas**: Visualización de métricas del inventario
- **🎨 Interfaz moderna**: Diseño responsivo con Tailwind CSS

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn
- Backend de Spring Boot corriendo en puerto 8080

## 🛠️ Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 📁 Estructura de Archivos Excel

El sistema espera archivos Excel con las siguientes columnas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `Descripcion` | Descripción del elemento | "Laptop Dell Inspiron 15" |
| `Categoria` | Categoría del producto | "Computadoras" |
| `Marca` | Marca del producto | "Dell" |
| `Modelo` | Modelo específico | "Inspiron 15 3000" |
| `Numero Serie` | Número de serie único | "DL001234" |
| `Cantidad Fisica` | Cantidad contada físicamente | 5 |
| `Cantidad Sistema` | Cantidad registrada en sistema | 6 |
| `Diferencia` | Diferencia calculada | -1 |
| `Observaciones` | Notas adicionales | "Falta una unidad" |

## 🎯 Funcionalidades

### 1. **Importar Excel**
- Arrastra y suelta un archivo Excel en la zona designada
- El sistema procesa automáticamente el archivo
- Los datos se muestran en una tabla

### 2. **Sincronización con Backend**
- **Obtener del Servidor**: Descarga datos desde el backend
- **Enviar al Servidor**: Sube los datos actuales al backend

### 3. **Exportar Excel**
- Genera un archivo Excel con los datos actuales
- Incluye fecha en el nombre del archivo
- Descarga automáticamente

### 4. **Estadísticas**
- Total de elementos
- Elementos con diferencias
- Sobrantes y faltantes
- Top categorías y marcas
- Porcentajes y métricas

## 🔧 Configuración

### Variables de Entorno

Puedes configurar las siguientes variables en un archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Endpoints del Backend

El frontend se conecta a los siguientes endpoints:

- `GET /api/inventario` - Obtener todos los elementos
- `POST /api/inventario/batch` - Enviar múltiples elementos

## 🎨 Personalización

### Colores y Estilos

El sistema usa Tailwind CSS. Puedes personalizar los colores editando `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        // ... más colores
      }
    }
  }
}
```

### Componentes

Los componentes principales están en:
- `src/pages/inventario.tsx` - Página principal de inventario
- `src/components/EstadisticasInventario.tsx` - Componente de estadísticas

## 📊 Ejemplo de Uso

1. **Generar archivo de ejemplo**:
   ```bash
   node generar-excel-ejemplo.js
   ```

2. **Cargar archivo**:
   - Ve a la página de inventario
   - Arrastra el archivo `inventario-ejemplo.xlsx`
   - Revisa los datos cargados

3. **Sincronizar con backend**:
   - Asegúrate de que el backend esté corriendo
   - Haz clic en "Enviar al Servidor"
   - Verifica en la consola del backend

## 🐛 Solución de Problemas

### Error de conexión con el backend
```
❌ Error al obtener datos del servidor
```
**Solución**: Verifica que el backend esté corriendo en `http://localhost:8080`

### Error al procesar Excel
```
❌ Error al procesar el archivo Excel
```
**Solución**: Verifica que el archivo tenga las columnas correctas

### Problemas de CORS
Si hay errores de CORS, configura el backend para permitir requests desde `http://localhost:3000`

## 📚 Dependencias Principales

- **Next.js**: Framework de React
- **React**: Biblioteca de UI
- **Tailwind CSS**: Framework de CSS
- **xlsx**: Manipulación de archivos Excel
- **react-dropzone**: Componente de drag & drop
- **axios**: Cliente HTTP

## 🚀 Despliegue

Para producción:

```bash
npm run build
npm start
```

O usando Vercel:
```bash
npx vercel
```

## 📄 Licencia

Este proyecto está bajo la licencia ISC.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**🎉 ¡Listo! Tu sistema de inventario está funcionando.**
