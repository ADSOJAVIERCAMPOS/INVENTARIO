package INVENTARIO.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import INVENTARIO.demo.entidades.User;
import INVENTARIO.demo.repositorios.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Guarda un nuevo usuario con la contraseña encriptada
     */
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Busca un usuario por nombre de usuario
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Obtiene todos los usuarios
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Busca un usuario por ID
     */
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Elimina un usuario por ID
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Verifica si un usuario existe por nombre de usuario
     */
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username) != null;
    }
}
