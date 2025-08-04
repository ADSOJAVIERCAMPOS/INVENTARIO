package INVENTARIO.demo.config;

import java.io.IOException;
import java.io.InputStreamReader;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import INVENTARIO.demo.entidades.InventarioFisico;
import INVENTARIO.demo.repositorios.InventarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initInventario(InventarioRepository inventarioRepository) {
        return args -> {
            if (inventarioRepository.count() == 0) {
                System.out.println("Iniciando carga de datos de inventario desde CSV...");
                
                if (loadFromCSV(inventarioRepository)) {
                    System.out.println("Datos de inventario cargados exitosamente desde CSV.");
                } else {
                    System.out.println("No se pudo cargar el archivo CSV de inventario. Asegúrate de que el nombre del archivo en el código coincida con el nombre del archivo en src/main/resources/.");
                }
            } else {
                System.out.println("Los datos de inventario ya están cargados en la base de datos.");
            }
        };
    }

    private boolean loadFromCSV(InventarioRepository inventarioRepository) {
        // Por favor, verifica que este nombre de archivo sea EXACTO al de tu archivo en la carpeta 'resources'
        String fileName = "Inventario Fisico.xlsx - Inventario Fisico.csv.xlsx";

        try {
            ClassPathResource resource = new ClassPathResource(fileName);
            if (!resource.exists()) {
                System.out.println("Archivo '" + fileName + "' no encontrado en recursos.");
                return false;
            }
            
            try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
                String[] line;
                int rowCount = 0;
                int errorCount = 0;
                
                // Omitir las primeras 15 filas según especificación
                for (int i = 0; i < 15; i++) {
                    String[] skippedLine = reader.readNext();
                    if (skippedLine == null) break;
                }
                
                while ((line = reader.readNext()) != null) {
                    if (line.length >= 9) {
                        try {
                            InventarioFisico item = new InventarioFisico();
                            item.setRegional(parseInteger(line[0]));
                            item.setCentro(parseInteger(line[1]));
                            item.setModulo(parseString(line[2]));
                            item.setPlaca(parseString(line[3]));
                            item.setValor(parseDouble(line[4]));
                            item.setAmbiente(parseString(line[5]));
                            item.setStockFisico(parseString(line[6]));
                            item.setDescripcion(parseString(line[7]));
                            item.setObservacion(parseString(line[8]));
                            
                            // Validar que la placa no esté vacía (es el ID)
                            if (item.getPlaca() != null && !item.getPlaca().trim().isEmpty()) {
                                inventarioRepository.save(item);
                                rowCount++;
                            } else {
                                errorCount++;
                            }
                        } catch (Exception e) {
                            errorCount++;
                            System.out.println("Error procesando línea CSV: " + e.getMessage());
                        }
                    }
                }
                
                System.out.println("Procesadas " + rowCount + " filas exitosamente.");
                if (errorCount > 0) {
                    System.out.println("Se encontraron " + errorCount + " errores durante el procesamiento.");
                }
                return rowCount > 0;
                
            }
        } catch (IOException | CsvValidationException e) {
            System.out.println("Error al cargar desde CSV: " + e.getMessage());
            return false;
        }
    }

    // Métodos auxiliares para parsing
    private String parseString(String value) {
        return (value != null && !value.trim().isEmpty()) ? value.trim() : null;
    }

    private Integer parseInteger(String value) {
        if (value == null || value.trim().isEmpty()) return null;
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double parseDouble(String value) {
        if (value == null || value.trim().isEmpty()) return null;
        try {
            return value.trim().isEmpty() ? null : Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
