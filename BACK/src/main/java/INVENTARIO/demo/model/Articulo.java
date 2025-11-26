package INVENTARIO.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "articulos")
public class Articulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_articulo")
    private String codigoArticulo;
    
    @Column(name = "descripcion", length = 500)
    private String descripcion;
    
    @Column(name = "cantidad_teorica")
    private Integer cantidadTeorica;
    
    @Column(name = "placa")
    private String placa;
    
    @Column(name = "observaciones", length = 1000)
    private String observaciones;
    
    @Column(name = "estado")
    private String estado;
    
    @Column(name = "clasificacion")
    private String clasificacion;
    
    @Column(name = "ubicacion")
    private String ubicacion;
    
    @Column(name = "codigo_barras", unique = true)
    private String codigoBarras;
    
    @Column(name = "qr_code")
    private String qrCode;

    // Constructores
    public Articulo() {}

    public Articulo(String codigoArticulo, String descripcion, Integer cantidadTeorica, 
                   String placa, String observaciones, String estado, String clasificacion, String ubicacion) {
        this.codigoArticulo = codigoArticulo;
        this.descripcion = descripcion;
        this.cantidadTeorica = cantidadTeorica;
        this.placa = placa;
        this.observaciones = observaciones;
        this.estado = estado;
        this.clasificacion = clasificacion;
        this.ubicacion = ubicacion;
    }
    
    public Articulo(String codigoArticulo, String descripcion, Integer cantidadTeorica, 
                   String placa, String observaciones, String estado, String clasificacion, 
                   String ubicacion, String codigoBarras, String qrCode) {
        this(codigoArticulo, descripcion, cantidadTeorica, placa, observaciones, estado, clasificacion, ubicacion);
        this.codigoBarras = codigoBarras;
        this.qrCode = qrCode;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigoArticulo() {
        return codigoArticulo;
    }

    public void setCodigoArticulo(String codigoArticulo) {
        this.codigoArticulo = codigoArticulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getCantidadTeorica() {
        return cantidadTeorica;
    }

    public void setCantidadTeorica(Integer cantidadTeorica) {
        this.cantidadTeorica = cantidadTeorica;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getClasificacion() {
        return clasificacion;
    }

    public void setClasificacion(String clasificacion) {
        this.clasificacion = clasificacion;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getCodigoBarras() {
        return codigoBarras;
    }

    public void setCodigoBarras(String codigoBarras) {
        this.codigoBarras = codigoBarras;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    @Override
    public String toString() {
        return "Articulo{" +
                "id=" + id +
                ", codigoArticulo='" + codigoArticulo + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", cantidadTeorica=" + cantidadTeorica +
                ", placa='" + placa + '\'' +
                ", observaciones='" + observaciones + '\'' +
                ", estado='" + estado + '\'' +
                ", clasificacion='" + clasificacion + '\'' +
                ", ubicacion='" + ubicacion + '\'' +
                ", codigoBarras='" + codigoBarras + '\'' +
                ", qrCode='" + qrCode + '\'' +
                '}';
    }
}