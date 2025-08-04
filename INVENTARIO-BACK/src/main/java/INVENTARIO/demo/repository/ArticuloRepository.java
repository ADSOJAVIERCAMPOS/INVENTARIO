package INVENTARIO.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import INVENTARIO.demo.model.Articulo;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
}
