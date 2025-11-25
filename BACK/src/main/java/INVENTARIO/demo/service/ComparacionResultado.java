package INVENTARIO.demo.service;

import java.util.LinkedHashMap;
import java.util.List;

public class ComparacionResultado {
    private List<DiferenciaDTO> diferencias;
    private List<LinkedHashMap<String, Object>> datosArchivo;
    public ComparacionResultado(List<DiferenciaDTO> diferencias, List<LinkedHashMap<String, Object>> datosArchivo) {
        this.diferencias = diferencias;
        this.datosArchivo = datosArchivo;
    }
    public List<DiferenciaDTO> getDiferencias() { return diferencias; }
    public List<LinkedHashMap<String, Object>> getDatosArchivo() { return datosArchivo; }
}
