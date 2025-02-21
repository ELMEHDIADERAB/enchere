package com.example.enchere.repository;

import com.example.enchere.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByNomUtilisateur(String nomUtilisateur);
    Optional<User> findByEmail(String email);
}