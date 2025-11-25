package INVENTARIO.demo.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "inventario_fisico", 
       indexes = {
           @Index(name = "idx_regional_centro", columnList = "regional, centro"),
           @Index(name = "idx_ambiente", columnList = "ambiente"),
           @Index(name = "idx_modulo", columnList = "modulo")
       })
public class InventarioFisico {
    @Id
    @Column(name = "placa", nullable = false)
    private String placa;
    private Integer regional;
    private Integer centro;
    private String modulo;
    private Double valor;
    private String ambiente;
    private String stockFisico;
    private String descripcion;
    private String observacion;

    // Constructor por defecto
    public InventarioFisico() {}

    // Constructor con parámetros
    public InventarioFisico(String placa, Integer regional, Integer centro, String modulo, 
                           Double valor, String ambiente, String stockFisico, 
                           String descripcion, String observacion) {
        this.placa = placa;
        this.regional = regional;
        this.centro = centro;
        this.modulo = modulo;
        this.valor = valor;
        this.ambiente = ambiente;
        this.stockFisico = stockFisico;
        this.descripcion = descripcion;
        this.observacion = observacion;
    }

    // Getters y Setters
    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public Integer getRegional() {
        return regional;
    }

    public void setRegional(Integer regional) {
        this.regional = regional;
    }

    public Integer getCentro() {
        return centro;
    }

    public void setCentro(Integer centro) {
        this.centro = centro;
    }

    public String getModulo() {
        return modulo;
    }

    public void setModulo(String modulo) {
        this.modulo = modulo;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getAmbiente() {
        return ambiente;
    }

    public void setAmbiente(String ambiente) {
        this.ambiente = ambiente;
    }

    public String getStockFisico() {
        return stockFisico;
    }

    public void setStockFisico(String stockFisico) {
        this.stockFisico = stockFisico;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    @Override
    public String toString() {
        return "InventarioFisico{" +
                "placa='" + placa + '\'' +
                ", regional=" + regional +
                ", centro=" + centro +
                ", modulo='" + modulo + '\'' +
                ", valor=" + valor +
                ", ambiente='" + ambiente + '\'' +
                ", stockFisico='" + stockFisico + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", observacion='" + observacion + '\'' +
                '}';
    }
}
