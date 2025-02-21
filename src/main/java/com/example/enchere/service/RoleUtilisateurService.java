package com.example.enchere.service;

import com.example.enchere.entities.RoleUtilisateur;

import java.util.List;
import java.util.Optional;

public interface RoleUtilisateurService {
    List<RoleUtilisateur> getAllRoles();
    Optional<RoleUtilisateur> getRoleById(Long id);
    RoleUtilisateur saveRole(RoleUtilisateur roleUtilisateur);
    void deleteRole(Long id);
}
