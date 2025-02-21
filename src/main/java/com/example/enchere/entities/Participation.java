package com.example.enchere.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Participation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "enchere_id")
    private Enchere enchere;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private BigDecimal prixPropose;
    private LocalDateTime dateParticipation;

    public Participation() {
    }
    //... Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Enchere getEnchere() {
        return enchere;
    }

    public void setEnchere(Enchere enchere) {
        this.enchere = enchere;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getPrixPropose() {
        return prixPropose;
    }

    public void setPrixPropose(BigDecimal prixPropose) {
        this.prixPropose = prixPropose;
    }

    public LocalDateTime getDateParticipation() {
        return dateParticipation;
    }

    public void setDateParticipation(LocalDateTime dateParticipation) {
        this.dateParticipation = dateParticipation;
    }
}