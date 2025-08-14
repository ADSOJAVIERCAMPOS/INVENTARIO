package INVENTARIO.demo.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelService {

    private List<InventarioItem> inventarioItems = new ArrayList<>();

    @PostConstruct
    public void cargarInventarioDesdeExcel() {
        try (InputStream inputStream = getClass().getResourceAsStream("/Inventario Fisico ADSO.xlsx");
             Workbook workbook = new XSSFWorkbook(inputStream)) {

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
            System.err.println("Error al cargar el archivo Excel: " + e.getMessage());
        }
    }

    public List<InventarioItem> obtenerInventario() {
        return inventarioItems;
    }

    public void actualizarInventario(List<InventarioItem> nuevosItems) {
        inventarioItems = nuevosItems;
        // Aquí puedes agregar lógica para guardar los cambios en el archivo Excel
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