package INVENTARIO.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import INVENTARIO.demo.model.Articulo;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    
    List<Articulo> findByPlaca(String placa);
    
    // Búsqueda por código de barras
    Optional<Articulo> findByCodigoBarras(String codigoBarras);
    
    // Búsqueda por código QR
    Optional<Articulo> findByQrCode(String qrCode);
    
    // Búsqueda inteligente por descripción (insensible a mayúsculas)
    @Query("SELECT a FROM Articulo a WHERE LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :descripcion, '%'))")
    List<Articulo> findByDescripcionContainingIgnoreCase(@Param("descripcion") String descripcion);
    
    // Búsqueda inteligente múltiple (descripción, código, placa)
    @Query("SELECT a FROM Articulo a WHERE " +
           "LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(a.codigoArticulo) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(a.placa) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(a.ubicacion) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Articulo> busquedaInteligente(@Param("termino") String termino);
    
    // Búsqueda por estado
    List<Articulo> findByEstadoIgnoreCase(String estado);
    
    // Búsqueda por clasificación
    List<Articulo> findByClasificacionIgnoreCase(String clasificacion);
    
    // Búsqueda avanzada con múltiples criterios
    @Query("SELECT a FROM Articulo a WHERE " +
           "(:descripcion IS NULL OR LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :descripcion, '%'))) AND " +
           "(:estado IS NULL OR LOWER(a.estado) = LOWER(:estado)) AND " +
           "(:clasificacion IS NULL OR LOWER(a.clasificacion) = LOWER(:clasificacion)) AND " +
           "(:ubicacion IS NULL OR LOWER(a.ubicacion) LIKE LOWER(CONCAT('%', :ubicacion, '%')))")
    List<Articulo> busquedaAvanzada(@Param("descripcion") String descripcion,
                                   @Param("estado") String estado,
                                   @Param("clasificacion") String clasificacion,
                                   @Param("ubicacion") String ubicacion);
}
