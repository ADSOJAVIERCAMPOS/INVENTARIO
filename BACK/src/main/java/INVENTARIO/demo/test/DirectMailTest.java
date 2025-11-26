package INVENTARIO.demo.test;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Properties;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

/**
 * Prueba directa del sistema de correo sin Spring Boot
 */
public class DirectMailTest {

    public static void main(String[] args) {
        System.out.println("================================");
        System.out.println("  PRUEBA DIRECTA DE CORREO GMAIL");
        System.out.println("================================");
        
        // Configuración desde variables de entorno o valores por defecto
        String username = System.getenv("MAIL_USERNAME");
        String password = System.getenv("MAIL_PASSWORD");
        String recipient = System.getenv("NOTIFICATION_EMAIL");
        
        if (username == null) username = "jc2583@gmail.com";
        if (password == null) password = "sbxi ioio vdrq tkhj";
        if (recipient == null) recipient = "jc2583@gmail.com";
        
        System.out.println("Username: " + username);
        System.out.println("Recipient: " + recipient);
        System.out.println("Password: " + (password != null ? "***configurada***" : "NO CONFIGURADA"));
        
        try {
            // Configurar propiedades SMTP para Gmail
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");
            props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
            
            System.out.println("\n🔧 Configurando sesión de correo...");
            
            // Crear sesión con autenticación (variables finales)
            final String finalUsername = username;
            final String finalPassword = password;
            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(finalUsername, finalPassword);
                }
            });
            
            System.out.println("✅ Sesión creada correctamente");
            
            // Crear mensaje
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient));
            message.setSubject("🧪 PRUEBA - Sistema de Notificaciones INVENTARIO ADSO");
            
            String contenido = String.format(
                "¡Hola! 👋\n\n" +
                "Esta es una prueba del sistema de notificaciones automáticas.\n\n" +
                "📅 Fecha y Hora: %s\n" +
                "🎯 Sistema: INVENTARIO ADSO\n" +
                "🔧 Método: Prueba directa Java Mail\n" +
                "✉️ Desde: %s\n" +
                "📧 Para: %s\n\n" +
                "Si recibes este correo, el sistema de notificaciones está funcionando correctamente. ✅\n\n" +
                "Próximas notificaciones automáticas:\n" +
                "• Acceso al sistema 🔑\n" +
                "• Modificaciones de datos 📝\n" +
                "• Descargas de reportes 📊\n" +
                "• Cargas de archivos 📁\n\n" +
                "¡Sistema configurado y listo! 🚀\n\n" +
                "---\n" +
                "Sistema de Monitoreo Automático\n" +
                "INVENTARIO ADSO - 2025",
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")),
                username,
                recipient
            );
            
            message.setText(contenido);
            
            System.out.println("📧 Enviando correo de prueba...");
            
            // Enviar mensaje
            Transport.send(message);
            
            System.out.println("✅ ¡CORREO ENVIADO EXITOSAMENTE!");
            System.out.println("📬 Revisa tu bandeja de entrada: " + recipient);
            System.out.println("📂 También revisa la carpeta de SPAM por si acaso");
            
        } catch (MessagingException e) {
            System.err.println("❌ ERROR enviando correo:");
            System.err.println("Tipo: " + e.getClass().getSimpleName());
            System.err.println("Mensaje: " + e.getMessage());
            
            if (e.getMessage().contains("Authentication failed")) {
                System.err.println("\n🔑 POSIBLES SOLUCIONES:");
                System.err.println("1. Verifica que la contraseña de aplicación sea correcta");
                System.err.println("2. Asegúrate de tener habilitada la verificación en 2 pasos");
                System.err.println("3. Genera una nueva contraseña de aplicación en Gmail");
            }
            
        } catch (Exception e) {
            System.err.println("❌ ERROR inesperado:");
            System.err.println("Mensaje: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("\n================================");
        System.out.println("  PRUEBA FINALIZADA");
        System.out.println("================================");
    }
}