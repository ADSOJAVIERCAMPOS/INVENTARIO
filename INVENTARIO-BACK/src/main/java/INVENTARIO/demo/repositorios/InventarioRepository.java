package INVENTARIO.demo.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import INVENTARIO.demo.entidades.InventarioFisico;

@Repository
public interface InventarioRepository extends JpaRepository<InventarioFisico, String> {
    
    // Buscar por regional
    List<InventarioFisico> findByRegional(Integer regional);
    
    // Buscar por centro
    List<InventarioFisico> findByCentro(Integer centro);
    
    // Buscar por módulo
    List<InventarioFisico> findByModulo(String modulo);
    
    // Buscar por ambiente
    List<InventarioFisico> findByAmbiente(String ambiente);
    
    // Buscar por descripción que contenga un texto
    List<InventarioFisico> findByDescripcionContainingIgnoreCase(String descripcion);
    
    // Buscar por rango de valores
    @Query("SELECT i FROM InventarioFisico i WHERE i.valor BETWEEN :valorMin AND :valorMax")
    List<InventarioFisico> findByValorBetween(@Param("valorMin") Double valorMin, @Param("valorMax") Double valorMax);
}
