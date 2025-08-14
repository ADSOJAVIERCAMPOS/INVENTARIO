package INVENTARIO.demo.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelReader {

    public List<InventarioItem> leerInventarioExcel(String filePath) throws IOException {
        List<InventarioItem> inventarioList = new ArrayList<>();

        // Usar try-with-resources para garantizar el cierre de recursos
        try (FileInputStream fis = new FileInputStream(new File(filePath));
             Workbook workbook = new XSSFWorkbook(fis)) {

            // Obtener la primera hoja del libro
            Sheet sheet = workbook.getSheetAt(0);

            // Iterar sobre las filas
            Iterator<Row> rowIterator = sheet.iterator();

            // Omitir la fila de encabezados si existe
            if (rowIterator.hasNext()) {
                rowIterator.next();
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Iterator<Cell> cellIterator = row.cellIterator();

                // Crear un nuevo objeto InventarioItem
                InventarioItem item = new InventarioItem();

                // Leer el número de placa (identificador único) de la primera columna
                if (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    item.setNumeroPlaca(cell.getStringCellValue());
                }

                // Leer la descripción de la segunda columna
                if (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    item.setDescripcion(cell.getStringCellValue());
                }

                // Leer la cantidad de la tercera columna
                if (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    if (cell.getCellType() == CellType.NUMERIC) {
                        item.setCantidad((int) cell.getNumericCellValue());
                    }
                }

                // Agregar el objeto a la lista
                inventarioList.add(item);
            }
        }

        return inventarioList;
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
