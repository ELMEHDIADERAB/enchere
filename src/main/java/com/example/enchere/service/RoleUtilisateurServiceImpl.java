package com.example.enchere.service;

import com.example.enchere.entities.RoleUtilisateur;
import com.example.enchere.repository.RoleUtilisateurRepository;
import com.example.enchere.service.RoleUtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleUtilisateurServiceImpl implements RoleUtilisateurService {
@Autowired
private RoleUtilisateurRepository roleUtilisateurRepository;

@Override
public List<RoleUtilisateur> getAllRoles() {
    return roleUtilisateurRepository.findAll();
}

@Override
public Optional<RoleUtilisateur> getRoleById(Long id) {
    return roleUtilisateurRepository.findById(id);
}

@Override
public RoleUtilisateur saveRole(RoleUtilisateur roleUtilisateur) {
    return roleUtilisateurRepository.save(roleUtilisateur);
}

@Override
public void deleteRole(Long id) {
    roleUtilisateurRepository.deleteById(id);
}
}