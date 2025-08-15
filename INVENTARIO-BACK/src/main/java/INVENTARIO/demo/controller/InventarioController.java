package INVENTARIO.demo.controller;

import INVENTARIO.demo.service.ExcelService;
import INVENTARIO.demo.service.ExcelService.InventarioItem;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private ExcelService excelService;

    private final String rutaArchivo = "src/main/resources/Inventario Fisico ADSO.xlsx";

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
                    item.setNumeroPlaca(row.getCell(0).getStringCellValue()); // Primera celda: número de placa
                    item.setDescripcion(row.getCell(1).getStringCellValue()); // Segunda celda: descripción
                    item.setCantidad((int) row.getCell(2).getNumericCellValue()); // Tercera celda: cantidad
                    inventarioItems.add(item);
                }
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar el archivo: " + e.getMessage());
        }

        return ResponseEntity.ok(inventarioItems);
    }
}
