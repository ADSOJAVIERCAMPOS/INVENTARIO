# INSTRUCCIONES PARA CONFIGURAR EL COMANDO 'startback'

## 📋 Para usar 'startback' desde cualquier terminal:

### Opción 1: Agregar al PATH (Recomendado)
1. Copia la ruta completa del proyecto:
   ```
   c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK
   ```

2. Agrega esta ruta a las variables de entorno PATH:
   - Presiona `Win + R`, escribe `sysdm.cpl`
   - Ve a "Opciones avanzadas" → "Variables de entorno"
   - En "Variables del sistema", busca "Path" y edítala
   - Agrega la ruta del proyecto
   - Reinicia la terminal

3. Ahora puedes usar desde cualquier lugar:
   ```bash
   startback
   ```

### Opción 2: Desde la carpeta del proyecto
```bash
cd "c:\Users\AdminSena\Desktop\ADSO\INVENTARIO-BACK"
startback.bat
```

### Opción 3: Hacer doble clic
- Ve a la carpeta del proyecto
- Haz doble clic en `startback.bat`

## ✅ RESULTADO FINAL

Ahora tienes 4 formas de iniciar tu backend:

1. **startback.bat** (doble clic o terminal)
2. **startback.ps1** (PowerShell)
3. **Tarea de VS Code** (Ctrl+Shift+P → startback)
4. **Comando original** (mvn spring-boot:run)

¡Elige la que más te guste! 🚀
