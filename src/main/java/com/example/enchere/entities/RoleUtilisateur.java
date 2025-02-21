package com.example.enchere.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Entity
@AllArgsConstructor
@Builder
public class RoleUtilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String nomRole;
    public RoleUtilisateur() {
    }

    public RoleUtilisateur(String nomRole) {
        this.nomRole = nomRole;
    }
    //... Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomRole() {
        return nomRole;
    }

    public void setNomRole(String nomRole) {
        this.nomRole = nomRole;
    }
}