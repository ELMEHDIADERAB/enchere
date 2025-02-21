package com.example.enchere.service;

import com.example.enchere.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    User saveUser(User user);
    void deleteUser(Long id);
    User getUserByUsername(String nomUtilisateur);
    User getUserByEmail(String email);
    User registerUser(User user);
    User activateUser(Long id);
    User deactivateUser(Long id);
    User updateUser(Long id , User user);
    User UpdateUserProfile(Long id , User user);
}