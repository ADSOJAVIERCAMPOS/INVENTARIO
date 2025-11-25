package INVENTARIO.demo.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import INVENTARIO.demo.service.ExcelService;
import INVENTARIO.demo.service.ExcelService.ComparacionResultado;
import INVENTARIO.demo.service.ExcelService.InventarioItem;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private ExcelService excelService;

    private final String rutaArchivo = "src/main/resources/InventarioFisicoADSO.xlsx";

    // Endpoint para listar los datos del archivo Excel almacenado en el servidor
    @GetMapping
    public List<InventarioItem> listarInventario() throws IOException {
        return excelService.obtenerInventario();
    }

    // Endpoint para guardar los datos en el archivo Excel almacenado en el servidor
    @PostMapping
    public String guardarInventario(@RequestBody List<InventarioItem> inventarioItems) throws IOException {
        excelService.actualizarInventario(inventarioItems);
        return "Inventario actualizado correctamente.";
    }

    // Endpoint para subir y procesar un archivo Excel desde el frontend
    @PostMapping("/subir-excel")
    public ResponseEntity<?> procesarExcel(@RequestParam("file") MultipartFile file) {
        List<InventarioItem> inventarioItems = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream(); Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Empieza desde la segunda fila
                Row row = sheet.getRow(i);
                if (row != null) {
                    InventarioItem item = new InventarioItem();
                    item.setNumeroPlaca(getCellValue(row.getCell(0))); // Primera celda: número de placa
                    item.setDescripcion(getCellValue(row.getCell(1))); // Segunda celda: descripción
                    item.setCantidad((int) getNumericCellValue(row.getCell(2))); // Tercera celda: cantidad

                    // Validar que los datos no estén vacíos
                    if (!item.getNumeroPlaca().isEmpty() || !item.getDescripcion().isEmpty() || item.getCantidad() > 0) {
                        inventarioItems.add(item);
                    }
                }
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar el archivo: " + e.getMessage());
        }

        return ResponseEntity.ok(inventarioItems);
    }

    // Buscar un elemento por número de placa
    @GetMapping("/buscar/{placa}")
    public ResponseEntity<?> buscarPorPlaca(@PathVariable String placa) {
        InventarioItem item = excelService.buscarPorPlaca(placa);
        if (item == null) {
            return ResponseEntity.status(404).body("No se encontró ningún elemento con esa placa.");
        }
        return ResponseEntity.ok(item);
    }

    // Comparar con nuevo Excel y obtener diferencias y datos completos
    @PostMapping("/comparar-excel-completo")
    public ResponseEntity<ComparacionResultado> compararExcelCompleto(@RequestParam("file") MultipartFile file) {
        ComparacionResultado resultado = excelService.compararConNuevoExcelConDatos(file);
        return ResponseEntity.ok(resultado);
    }

    // Método para obtener el valor de una celda como texto
    private String getCellValue(Cell cell) {
        return cell != null && cell.getCellType() == CellType.STRING ? cell.getStringCellValue() : "";
    }

    // Método para obtener el valor numérico de una celda
    private double getNumericCellValue(Cell cell) {
        return cell != null && cell.getCellType() == CellType.NUMERIC ? cell.getNumericCellValue() : 0;
    }
}