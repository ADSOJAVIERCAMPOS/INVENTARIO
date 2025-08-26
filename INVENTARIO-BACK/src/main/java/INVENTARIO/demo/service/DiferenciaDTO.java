package INVENTARIO.demo.service;

public class DiferenciaDTO {
    private String placa;
    private String descripcionActual;
    private String descripcionNueva;
    private Integer cantidadActual;
    private Integer cantidadNueva;
    private String tipoDiferencia;

    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
    public String getDescripcionActual() { return descripcionActual; }
    public void setDescripcionActual(String descripcionActual) { this.descripcionActual = descripcionActual; }
    public String getDescripcionNueva() { return descripcionNueva; }
    public void setDescripcionNueva(String descripcionNueva) { this.descripcionNueva = descripcionNueva; }
    public Integer getCantidadActual() { return cantidadActual; }
    public void setCantidadActual(Integer cantidadActual) { this.cantidadActual = cantidadActual; }
    public Integer getCantidadNueva() { return cantidadNueva; }
    public void setCantidadNueva(Integer cantidadNueva) { this.cantidadNueva = cantidadNueva; }
    public String getTipoDiferencia() { return tipoDiferencia; }
    public void setTipoDiferencia(String tipoDiferencia) { this.tipoDiferencia = tipoDiferencia; }
}
