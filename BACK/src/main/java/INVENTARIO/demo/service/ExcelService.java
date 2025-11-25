package INVENTARIO.demo.service;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ExcelService {

    private List<InventarioItem> inventarioItems = new ArrayList<>();
    private final String rutaArchivo = "InventarioFisicoADSO.xlsx";
    private List<DiferenciaDTO> diferenciasGeneradas = new ArrayList<>();

    @PostConstruct
    public void cargarInventarioDesdeExcel() {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(rutaArchivo);
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            if (inputStream == null) {
                throw new RuntimeException("El archivo Excel '" + rutaArchivo + "' no se encuentra en el directorio de recursos.");
            }

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Empieza desde la segunda fila
                Row row = sheet.getRow(i);
                if (row != null && row.getCell(0) != null) {
                    String valorCelda = getCellValue(row.getCell(0));
                    if (valorCelda.trim().equalsIgnoreCase("__VACÍO") || valorCelda.trim().startsWith("__EMPTY")) {
                        continue; // Ignora la fila de encabezado vacía
                    }
                    InventarioItem item = new InventarioItem();
                    item.setNumeroPlaca(valorCelda); // Primera celda: número de placa
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
            try (FileOutputStream fileOutputStream = new FileOutputStream("src/main/resources/" + rutaArchivo)) {
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

    public InventarioItem buscarPorPlaca(String placa) {
        if (placa == null || placa.trim().isEmpty()) return null;
        String placaBuscada = placa.replaceAll("\\D", "");
        return inventarioItems.stream()
                .filter(item -> {
                    String itemPlaca = item.getNumeroPlaca();
                    if (itemPlaca == null) return false;
                    String itemPlacaNum = itemPlaca.replaceAll("\\D", "");
                    return !itemPlacaNum.isEmpty() && itemPlacaNum.equals(placaBuscada);
                })
                .findFirst()
                .orElse(null);
    }

    public List<DiferenciaDTO> compararConNuevoExcel(MultipartFile file) {
        List<DiferenciaDTO> diferencias = new ArrayList<>();
        Map<String, InventarioItem> baseMap = new HashMap<>();
        for (InventarioItem item : inventarioItems) {
            baseMap.put(item.getNumeroPlaca(), item);
        }
        try (InputStream inputStream = file.getInputStream(); Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row != null && row.getCell(0) != null) {
                    String placa = getCellValue(row.getCell(0));
                    String descripcion = getCellValue(row.getCell(1));
                    int cantidad = (int) getNumericCellValue(row.getCell(2));
                    InventarioItem base = baseMap.get(placa);
                    if (base == null) {
                        DiferenciaDTO dif = new DiferenciaDTO();
                        dif.setPlaca(placa);
                        dif.setDescripcionActual("");
                        dif.setDescripcionNueva(descripcion);
                        dif.setCantidadActual(0);
                        dif.setCantidadNueva(cantidad);
                        dif.setTipoDiferencia("Sobrante");
                        diferencias.add(dif);
                    } else {
                        if (!base.getDescripcion().equals(descripcion) || base.getCantidad() != cantidad) {
                            DiferenciaDTO dif = new DiferenciaDTO();
                            dif.setPlaca(placa);
                            dif.setDescripcionActual(base.getDescripcion());
                            dif.setDescripcionNueva(descripcion);
                            dif.setCantidadActual(base.getCantidad());
                            dif.setCantidadNueva(cantidad);
                            dif.setTipoDiferencia("Modificado");
                            diferencias.add(dif);
                        }
                        baseMap.remove(placa);
                    }
                }
            }
            for (InventarioItem faltante : baseMap.values()) {
                DiferenciaDTO dif = new DiferenciaDTO();
                dif.setPlaca(faltante.getNumeroPlaca());
                dif.setDescripcionActual(faltante.getDescripcion());
                dif.setDescripcionNueva("");
                dif.setCantidadActual(faltante.getCantidad());
                dif.setCantidadNueva(0);
                dif.setTipoDiferencia("Faltante");
                diferencias.add(dif);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al comparar archivos: " + e.getMessage(), e);
        }
        diferenciasGeneradas = diferencias;
        return diferencias;
    }

    public Resource exportarDiferenciasAExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Diferencias");
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Placa");
            headerRow.createCell(1).setCellValue("Descripción Actual");
            headerRow.createCell(2).setCellValue("Descripción Nueva");
            headerRow.createCell(3).setCellValue("Cantidad Actual");
            headerRow.createCell(4).setCellValue("Cantidad Nueva");
            headerRow.createCell(5).setCellValue("Tipo Diferencia");
            for (int i = 0; i < diferenciasGeneradas.size(); i++) {
                DiferenciaDTO dif = diferenciasGeneradas.get(i);
                Row row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(dif.getPlaca());
                row.createCell(1).setCellValue(dif.getDescripcionActual());
                row.createCell(2).setCellValue(dif.getDescripcionNueva());
                row.createCell(3).setCellValue(dif.getCantidadActual());
                row.createCell(4).setCellValue(dif.getCantidadNueva());
                row.createCell(5).setCellValue(dif.getTipoDiferencia());
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error al exportar diferencias: " + e.getMessage(), e);
        }
    }

    public static class InventarioItem {
        private String numeroPlaca;
        private String descripcion;
        private int cantidad;
        private String stockFisico = "";

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

        public String getStockFisico() {
            return stockFisico;
        }

        public void setStockFisico(String stockFisico) {
            this.stockFisico = stockFisico;
        }
    }

    public static class DiferenciaDTO {
        private String placa;
        private String descripcionActual;
        private String descripcionNueva;
        private int cantidadActual;
        private int cantidadNueva;
        private String tipoDiferencia;

        // Getters y setters
        public String getPlaca() {
            return placa;
        }

        public void setPlaca(String placa) {
            this.placa = placa;
        }

        public String getDescripcionActual() {
            return descripcionActual;
        }

        public void setDescripcionActual(String descripcionActual) {
            this.descripcionActual = descripcionActual;
        }

        public String getDescripcionNueva() {
            return descripcionNueva;
        }

        public void setDescripcionNueva(String descripcionNueva) {
            this.descripcionNueva = descripcionNueva;
        }

        public int getCantidadActual() {
            return cantidadActual;
        }

        public void setCantidadActual(int cantidadActual) {
            this.cantidadActual = cantidadActual;
        }

        public int getCantidadNueva() {
            return cantidadNueva;
        }

        public void setCantidadNueva(int cantidadNueva) {
            this.cantidadNueva = cantidadNueva;
        }

        public String getTipoDiferencia() {
            return tipoDiferencia;
        }

        public void setTipoDiferencia(String tipoDiferencia) {
            this.tipoDiferencia = tipoDiferencia;
        }
    }

    public static class ComparacionResultado {
        private List<DiferenciaDTO> diferencias;
        private List<LinkedHashMap<String, Object>> datosArchivo;
        public ComparacionResultado(List<DiferenciaDTO> diferencias, List<LinkedHashMap<String, Object>> datosArchivo) {
            this.diferencias = diferencias;
            this.datosArchivo = datosArchivo;
        }
        public List<DiferenciaDTO> getDiferencias() { return diferencias; }
        public List<LinkedHashMap<String, Object>> getDatosArchivo() { return datosArchivo; }
    }

    public ComparacionResultado compararConNuevoExcelConDatos(MultipartFile file) {
        List<DiferenciaDTO> diferencias = new ArrayList<>();
        Map<String, InventarioItem> baseMap = new HashMap<>();
        for (InventarioItem item : inventarioItems) {
            baseMap.put(item.getNumeroPlaca(), item);
        }
        List<LinkedHashMap<String, Object>> datosArchivo = new ArrayList<>();
        try (InputStream inputStream = file.getInputStream(); Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            List<String> columnas = new ArrayList<>();
            for (Cell cell : headerRow) {
                columnas.add(cell.getStringCellValue());
            }
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row != null && row.getCell(0) != null) {
                    LinkedHashMap<String, Object> fila = new LinkedHashMap<>();
                    for (int c = 0; c < columnas.size(); c++) {
                        Cell cell = row.getCell(c);
                        Object valor = null;
                        if (cell != null) {
                            if (cell.getCellType() == CellType.STRING) valor = cell.getStringCellValue();
                            else if (cell.getCellType() == CellType.NUMERIC) valor = cell.getNumericCellValue();
                            else valor = "";
                        } else {
                            valor = "";
                        }
                        fila.put(columnas.get(c), valor);
                    }
                    datosArchivo.add(fila);
                    String placa = row.getCell(0).getStringCellValue();
                    String descripcion = row.getCell(1).getStringCellValue();
                    int cantidad = (int) (row.getCell(2).getCellType() == CellType.NUMERIC ? row.getCell(2).getNumericCellValue() : 0);
                    InventarioItem base = baseMap.get(placa);
                    if (base == null) {
                        DiferenciaDTO dif = new DiferenciaDTO();
                        dif.setPlaca(placa);
                        dif.setDescripcionActual("");
                        dif.setDescripcionNueva(descripcion);
                        dif.setCantidadActual(0);
                        dif.setCantidadNueva(cantidad);
                        dif.setTipoDiferencia("Sobrante");
                        diferencias.add(dif);
                    } else {
                        if (!base.getDescripcion().equals(descripcion) || base.getCantidad() != cantidad) {
                            DiferenciaDTO dif = new DiferenciaDTO();
                            dif.setPlaca(placa);
                            dif.setDescripcionActual(base.getDescripcion());
                            dif.setDescripcionNueva(descripcion);
                            dif.setCantidadActual(base.getCantidad());
                            dif.setCantidadNueva(cantidad);
                            dif.setTipoDiferencia("Modificado");
                            diferencias.add(dif);
                        }
                        baseMap.remove(placa);
                    }
                }
            }
            for (InventarioItem faltante : baseMap.values()) {
                DiferenciaDTO dif = new DiferenciaDTO();
                dif.setPlaca(faltante.getNumeroPlaca());
                dif.setDescripcionActual(faltante.getDescripcion());
                dif.setDescripcionNueva("");
                dif.setCantidadActual(faltante.getCantidad());
                dif.setCantidadNueva(0);
                dif.setTipoDiferencia("Faltante");
                diferencias.add(dif);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al comparar archivos: " + e.getMessage(), e);
        }
        diferenciasGeneradas = diferencias;
        return new ComparacionResultado(diferencias, datosArchivo);
    }
}