package INVENTARIO.demo.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelService {

    private List<InventarioItem> inventarioItems = new ArrayList<>();
    private final String rutaArchivo = "/Inventario Fisico ADSO.xlsx";

    @PostConstruct
    public void cargarInventarioDesdeExcel() {
        try (InputStream inputStream = getClass().getResourceAsStream(rutaArchivo);
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            if (inputStream == null) {
                throw new RuntimeException("El archivo Excel no se encuentra en el directorio de recursos.");
            }

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Empieza desde la segunda fila
                Row row = sheet.getRow(i);
                if (row != null) {
                    InventarioItem item = new InventarioItem();
                    item.setNumeroPlaca(getCellValue(row.getCell(0))); // Primera celda: número de placa
                    item.setDescripcion(getCellValue(row.getCell(1))); // Segunda celda: descripción
                    item.setCantidad((int) getNumericCellValue(row.getCell(2))); // Tercera celda: cantidad
                    inventarioItems.add(item);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al cargar el archivo Excel: " + e.getMessage(), e);
        }
    }

    public List<InventarioItem> obtenerInventario() {
        return inventarioItems;
    }

    public void actualizarInventario(List<InventarioItem> nuevosItems) {
        inventarioItems = nuevosItems;
        guardarInventarioEnExcel();
    }

    private void guardarInventarioEnExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Inventario");

            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Número de Placa");
            headerRow.createCell(1).setCellValue("Descripción");
            headerRow.createCell(2).setCellValue("Cantidad");

            // Agregar datos
            for (int i = 0; i < inventarioItems.size(); i++) {
                Row row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(inventarioItems.get(i).getNumeroPlaca());
                row.createCell(1).setCellValue(inventarioItems.get(i).getDescripcion());
                row.createCell(2).setCellValue(inventarioItems.get(i).getCantidad());
            }

            // Guardar archivo
            try (FileOutputStream fileOutputStream = new FileOutputStream("src/main/resources/Inventario Fisico ADSO.xlsx")) {
                workbook.write(fileOutputStream);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el archivo Excel: " + e.getMessage(), e);
        }
    }

    private String getCellValue(Cell cell) {
        return cell != null && cell.getCellType() == CellType.STRING ? cell.getStringCellValue() : "";
    }

    private double getNumericCellValue(Cell cell) {
        return cell != null && cell.getCellType() == CellType.NUMERIC ? cell.getNumericCellValue() : 0;
    }

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