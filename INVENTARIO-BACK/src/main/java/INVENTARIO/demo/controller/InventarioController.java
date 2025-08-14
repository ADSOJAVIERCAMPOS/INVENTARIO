package INVENTARIO.demo.controller;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @PostMapping("/subir-excel")
    public ResponseEntity<?> procesarExcel(@RequestParam("file") MultipartFile file) {
        List<InventarioItem> inventarioItems = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream(); Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Empieza desde la segunda fila
                Row row = sheet.getRow(i);
                if (row != null) {
                    InventarioItem item = new InventarioItem();
                    item.setNumeroPlaca(row.getCell(0).getStringCellValue()); // Suponiendo que la primera celda contiene el número de placa
                    item.setDescripcion(row.getCell(1).getStringCellValue()); // Suponiendo que la segunda celda contiene la descripción
                    item.setCantidad((int) row.getCell(2).getNumericCellValue()); // Suponiendo que la tercera celda contiene la cantidad
                    inventarioItems.add(item);
                }
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar el archivo: " + e.getMessage());
        }

        return ResponseEntity.ok(inventarioItems);
    }

    // Clase interna para representar un ítem del inventario
    public static class InventarioItem {
        private String numeroPlaca;
        private String descripcion;
        private int cantidad;

        // Getters y setters
        public String getNumeroPlaca() {
            return numeroPlaca;
        }

        public void setNumeroPlaca(String numeroPlaca) {
            this.numeroPlaca = numeroPlaca;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public void setDescripcion(String descripcion) {
            this.descripcion = descripcion;
        }

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }
    }
}
