package com.example.enchere.Custom;

import com.example.enchere.entities.Enchere;
import com.example.enchere.entities.Participation;

import java.util.List;
import java.util.Optional;

public class EnchereDetails {
    private Optional<Enchere> enchere;
    private List<Participation> participations;

    // Constructeur
    public EnchereDetails(Optional<Enchere> enchere, List<Participation> participations) {
        this.enchere = enchere;
        this.participations = participations;
    }

    // Getters et setters
    public Optional<Enchere> getEnchere() {
        return enchere;
    }

    public void setEnchere(Optional<Enchere> enchere) {
        this.enchere = enchere;
    }

    public List<Participation> getParticipations() {
        return participations;
    }

    public void setParticipations(List<Participation> participations) {
        this.participations = participations;
    }
}
