package com.example.enchere.config;

import com.example.enchere.entities.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
    // Méthode pour accéder à l'ID utilisateur

    private Long id; // Ajout de l'ID utilisateur
    private String nomUtilisateur;
    private String motDePasse;
    private List<GrantedAuthority> authorities;

    // Constructeur qui initialise les attributs à partir de l'entité User
    public CustomUserDetails(User user) {
        this.id = user.getId(); // Récupérer l'ID de l'utilisateur
        this.nomUtilisateur = user.getEmail(); // Récupérer l'email
        this.motDePasse = user.getMotDePasse();
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getNomRole()));
    }

    public Long getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return motDePasse;
    }

    @Override
    public String getUsername() {
        return nomUtilisateur;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

