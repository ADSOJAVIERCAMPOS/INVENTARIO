package INVENTARIO.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import INVENTARIO.demo.entidades.InventarioFisico;
import INVENTARIO.demo.repositorios.InventarioRepository;

@Service
public class InventarioService {

    @Autowired
    private InventarioRepository inventarioRepository;

    /**
     * Obtiene todos los elementos del inventario
     */
    public List<InventarioFisico> getAllInventario() {
        return inventarioRepository.findAll();
    }

    /**
     * Busca un elemento por placa
     */
    public InventarioFisico findByPlaca(String placa) {
        Optional<InventarioFisico> resultado = inventarioRepository.findById(placa);
        return resultado.orElse(null);
    }

    /**
     * Guarda un nuevo elemento de inventario
     */
    public InventarioFisico saveInventario(InventarioFisico inventario) {
        return inventarioRepository.save(inventario);
    }

    /**
     * Actualiza un elemento existente
     */
    public InventarioFisico updateInventario(InventarioFisico inventario) {
        return inventarioRepository.save(inventario);
    }

    /**
     * Elimina un elemento por placa
     */
    public void deleteByPlaca(String placa) {
        inventarioRepository.deleteById(placa);
    }

    /**
     * Busca elementos por regional
     */
    public List<InventarioFisico> findByRegional(Integer regional) {
        return inventarioRepository.findByRegional(regional);
    }

    /**
     * Busca elementos por centro
     */
    public List<InventarioFisico> findByCentro(Integer centro) {
        return inventarioRepository.findByCentro(centro);
    }

    /**
     * Busca elementos por módulo
     */
    public List<InventarioFisico> findByModulo(String modulo) {
        return inventarioRepository.findByModulo(modulo);
    }

    /**
     * Busca elementos por ambiente
     */
    public List<InventarioFisico> findByAmbiente(String ambiente) {
        return inventarioRepository.findByAmbiente(ambiente);
    }

    /**
     * Busca elementos por descripción (contiene texto)
     */
    public List<InventarioFisico> findByDescripcionContaining(String descripcion) {
        return inventarioRepository.findByDescripcionContainingIgnoreCase(descripcion);
    }

    /**
     * Busca elementos por rango de valores
     */
    public List<InventarioFisico> findByValorBetween(Double valorMin, Double valorMax) {
        return inventarioRepository.findByValorBetween(valorMin, valorMax);
    }

    /**
     * Cuenta el total de elementos en el inventario
     */
    public long countInventario() {
        return inventarioRepository.count();
    }

    /**
     * Verifica si existe un elemento con la placa dada
     */
    public boolean existsByPlaca(String placa) {
        return inventarioRepository.existsById(placa);
    }
}
