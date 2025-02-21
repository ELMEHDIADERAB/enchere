package com.example.enchere.repository;

import com.example.enchere.entities.RoleUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleUtilisateurRepository extends JpaRepository<RoleUtilisateur, Long> {
}