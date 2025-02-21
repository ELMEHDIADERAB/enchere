package com.example.enchere.service;

import com.example.enchere.entities.Participation;

import java.util.List;
import java.util.Optional;

public interface ParticipationService {
    List<Participation> getAllParticipations();
    Optional<Participation> getParticipationById(Long id);
    Participation saveParticipation(Participation participation);
    void deleteParticipation(Long id);
    List<Participation> getParticipationsByEnchereId(Long enchereId);
    List<Participation> getParticipationsByUserId(Long userId);
    List<Participation> getParticipationsByUserAndCategorie(Long userId,Long categorieId);
}