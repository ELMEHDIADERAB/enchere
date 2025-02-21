package com.example.enchere.service;

import com.example.enchere.entities.Participation;
import com.example.enchere.repository.ParticipationRepository;
import com.example.enchere.service.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ParticipationServiceImpl implements ParticipationService {

    @Autowired
    private ParticipationRepository participationRepository;

    @Override
    public List<Participation> getAllParticipations() {
        return participationRepository.findAll();
    }

    @Override
    public Optional<Participation> getParticipationById(Long id) {
        return participationRepository.findById(id);
    }

    @Override
    public Participation saveParticipation(Participation participation) {
        participation.setDateParticipation(LocalDateTime.now());
        return participationRepository.save(participation);
    }

    @Override
    public void deleteParticipation(Long id) {
        participationRepository.deleteById(id);
    }

    @Override
    public List<Participation> getParticipationsByEnchereId(Long enchereId) {
        return participationRepository.findByEnchereId(enchereId);
    }

    @Override
    public List<Participation> getParticipationsByUserId(Long userId) {
        return participationRepository.findByUserId(userId);
    }

    @Override
    public List<Participation> getParticipationsByUserAndCategorie(Long userId,Long categorieId) {
        return participationRepository.findParticipationsByUserIdAndCategoryIdOrderByDate(userId,categorieId);
    }
}