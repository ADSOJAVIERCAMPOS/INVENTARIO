package INVENTARIO.demo.dto;

import java.util.LinkedHashMap;
import java.util.List;

public class ArchivoExcelDTO {
    private List<LinkedHashMap<String, Object>> datosArchivo;
    public ArchivoExcelDTO(List<LinkedHashMap<String, Object>> datosArchivo) {
        this.datosArchivo = datosArchivo;
    }
    public List<LinkedHashMap<String, Object>> getDatosArchivo() { return datosArchivo; }
}
