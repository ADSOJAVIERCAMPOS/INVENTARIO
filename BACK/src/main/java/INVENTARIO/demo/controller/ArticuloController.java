package INVENTARIO.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import INVENTARIO.demo.model.Articulo;
import INVENTARIO.demo.repository.ArticuloRepository;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

    @Autowired
    private ArticuloRepository articuloRepository;

    // Obtener todos los artículos
    @GetMapping
    public ResponseEntity<List<Articulo>> getAllArticulos() {
        return new ResponseEntity<>(articuloRepository.findAll(), HttpStatus.OK);
    }

    // Obtener un artículo por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getArticuloById(@PathVariable String id) {
        if ("new".equals(id)) {
            // Lógica para manejar el caso especial "new"
            return ResponseEntity.ok("Creando un nuevo artículo...");
        }

        try {
            Long articuloId = Long.parseLong(id);
            Optional<Articulo> articulo = articuloRepository.findById(articuloId);
            return articulo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("El ID proporcionado no es válido.");
        }
    }

    // Crear un nuevo artículo
    @PostMapping
    public ResponseEntity<Articulo> createArticulo(@RequestBody Articulo articulo) {
        Articulo newArticulo = articuloRepository.save(articulo);
        return new ResponseEntity<>(newArticulo, HttpStatus.CREATED);
    }

    // Actualizar un artículo existente
    @PutMapping("/{id}")
    public ResponseEntity<Articulo> updateArticulo(@PathVariable Long id, @RequestBody Articulo articuloDetails) {
        Optional<Articulo> optionalArticulo = articuloRepository.findById(id);
        if (optionalArticulo.isPresent()) {
            Articulo existingArticulo = optionalArticulo.get();
            existingArticulo.setCodigoArticulo(articuloDetails.getCodigoArticulo());
            existingArticulo.setDescripcion(articuloDetails.getDescripcion());
            existingArticulo.setCantidadTeorica(articuloDetails.getCantidadTeorica());
            existingArticulo.setPlaca(articuloDetails.getPlaca());
            existingArticulo.setObservaciones(articuloDetails.getObservaciones());
            existingArticulo.setEstado(articuloDetails.getEstado());
            existingArticulo.setClasificacion(articuloDetails.getClasificacion());
            existingArticulo.setUbicacion(articuloDetails.getUbicacion());

            return new ResponseEntity<>(articuloRepository.save(existingArticulo), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un artículo por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteArticulo(@PathVariable Long id) {
        try {
            articuloRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Buscar un artículo por placa
    @GetMapping("/buscar/{placa}")
    public ResponseEntity<?> getArticuloByPlaca(@PathVariable String placa) {
        List<Articulo> articulos = articuloRepository.findByPlaca(placa);
        if (articulos.isEmpty()) {
            return new ResponseEntity<>("No se encontró ningún artículo con la placa proporcionada.", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(articulos, HttpStatus.OK);
    }
}