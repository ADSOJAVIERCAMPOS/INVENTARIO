# 🔐 CREDENCIALES DE ACCESO - Sistema de Inventario

## 👤 Usuario Principal Creado

### Coordinador (Administrador)
- **Usuario**: `Coordinador`
- **Contraseña**: `JimmyVelandia`
- **Rol**: `ADMIN`
- **Descripción**: Usuario principal para coordinación del inventario

### Usuario Administrador Adicional
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Rol**: `ADMIN`
- **Descripción**: Usuario alternativo de administración

## 🌐 URLs de Acceso

### Página de Login
- **URL**: http://localhost:8080/login
- **Descripción**: Formulario de autenticación

### Después del Login
- **Dashboard**: http://localhost:8080/
- **Panel de Inventario**: http://localhost:8080/inventario
- **API de Artículos**: http://localhost:8080/api/articulos

## 🚀 Cómo Usar

1. **Ejecuta la aplicación**:
   ```bash
   mvn spring-boot:run
   ```

2. **Ve al navegador**:
   ```
   http://localhost:8080/login
   ```

3. **Ingresa las credenciales**:
   - **Usuario**: `Coordinador`
   - **Contraseña**: `JimmyVelandia`

4. **Haz clic en "Inicia sesión"**

## ✅ Estado de los Usuarios

Al iniciar la aplicación, verás en la consola:
```
✅ Usuario creado: Coordinador / JimmyVelandia
✅ Usuario creado: admin / admin123
```

Si ya existen los usuarios, verás:
```
ℹ️ Usuario 'Coordinador' ya existe
ℹ️ Usuario 'admin' ya existe
```

## 🔒 Seguridad

- **Contraseñas encriptadas**: Las contraseñas se guardan con BCrypt
- **Autenticación Spring Security**: Sistema robusto de seguridad
- **Roles de usuario**: Sistema de permisos basado en roles

## 📋 Funcionalidades Disponibles

Una vez autenticado, podrás:
- ✅ Ver el dashboard principal
- ✅ Acceder al panel de inventario
- ✅ Consultar la API REST de artículos
- ✅ Navegar entre las diferentes vistas

---

**¡Ya puedes acceder a tu sistema con el usuario Coordinador!** 🎉
