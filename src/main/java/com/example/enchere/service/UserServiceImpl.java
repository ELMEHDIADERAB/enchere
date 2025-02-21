package com.example.enchere.service;

import com.example.enchere.exception.ResourceNotFoundException;
import com.example.enchere.entities.User;
import com.example.enchere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User saveUser(User user) {
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        user.setDateInscription(LocalDateTime.now());
        user.setActive(true);
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public User getUserByUsername(String nomUtilisateur) {
        return userRepository.findByNomUtilisateur(nomUtilisateur)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + nomUtilisateur));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    public User registerUser(User user) {
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        user.setDateInscription(LocalDateTime.now());
        user.setActive(true);
        return userRepository.save(user);
    }

    @Override
    public User activateUser(Long id) {
        User user = getUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(true);
        return userRepository.save(user);
    }

    @Override
    public User deactivateUser(Long id) {
        User user = getUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(false);
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = getUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Mise à jour des informations utilisateur
        existingUser.setNom(user.getNom());
        existingUser.setPrenom(user.getPrenom());
        existingUser.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        existingUser.setAdresse(user.getAdresse());
        existingUser.setTel(user.getTel());
        existingUser.setRole(user.getRole());

        // Sauvegarde des modifications
        return userRepository.save(existingUser);
    }
    @Override
    public User UpdateUserProfile(Long id, User user) {
        User existingUser = getUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Mise à jour des informations utilisateur
        existingUser.setNom(user.getNom());
        existingUser.setPrenom(user.getPrenom());
        existingUser.setAdresse(user.getAdresse());
        existingUser.setTel(user.getTel());

        // Ne met à jour le mot de passe que s'il est fourni
        if (user.getMotDePasse() != null && !user.getMotDePasse().isEmpty()) {
            existingUser.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        }

        // Sauvegarde des modifications
        return userRepository.save(existingUser);
    }


}



//package com.example.enchere.service;
//
//import com.example.enchere.exception.ResourceNotFoundException;
//import com.example.enchere.entities.User;
//import com.example.enchere.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class UserServiceImpl implements UserService {
//
//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Override
//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//
//    @Override
//    public Optional<User> getUserById(Long id) {
//        return userRepository.findById(id);
//    }
//
//    @Override
//    public User saveUser(User user) {
//        user.setMotDePasse((passwordEncoder.encode(user.getMotDePasse())));
//        user.setDateInscription(LocalDateTime.now());
//        user.setActive(true);
//        return userRepository.save(user);
//    }
//
//    @Override
//    public void deleteUser(Long id) {
//        userRepository.deleteById(id);
//    }
//    @Override
//    public User getUserByUsername(String nomUtilisateur) {
//        return userRepository.findByNomUtilisateur(nomUtilisateur)
//                .orElseThrow(()->new ResourceNotFoundException("User not found with username : "+nomUtilisateur));
//    }
//    @Override
//    public User getUserByEmail(String email) {
//        return userRepository.findByEmail(email)
//                .orElseThrow(()->new ResourceNotFoundException("User not found with email : "+email));
//    }
//    @Override
//    public User registerUser(User user) {
//        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
//        user.setDateInscription(LocalDateTime.now());
//        user.setActive(true);
//        return userRepository.save(user);
//    }
//
//    @Override
//    public User activateUser(Long id) {
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id : " + id));
//        user.setActive(true);
//        return userRepository.save(user);
//    }
//
//    @Override
//    public User deactivateUser(Long id) {
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id : " + id));
//        user.setActive(false);
//        return userRepository.save(user);
//    }
//
//    @Override
//    public User updateUser(Long id, User user) {
//        User existingUser = userRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id : " + id));
//        existingUser.setNom(user.getNom());
//        existingUser.setPrenom(user.getPrenom());
//        existingUser.setAdresse(user.getAdresse());
//        existingUser.setTel(user.getTel());
//        existingUser.setRole(user.getRole());
//        return userRepository.save(existingUser);
//
//    }
//}