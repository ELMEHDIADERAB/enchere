package com.example.enchere.service;

import com.example.enchere.Custom.EnchereDetails;
import com.example.enchere.entities.Enchere;
import com.example.enchere.enums.StatutEnchere;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface EnchereService {
    List<Enchere> getAllEncheres();
    Optional<Enchere> getEnchereById(Long id);
    Enchere saveEnchere(Enchere enchere);
    void deleteEnchere(Long id);
    List<Enchere> getEncheresByProductId(Long productId);
    Enchere updateEnchere(Long id, Enchere enchere);
    Enchere updateStatutEnchere(Long id ,StatutEnchere statut);
    List<Enchere> getEncheresByStatut(StatutEnchere statut);
    EnchereDetails getEnchereDetailsById(Long id);
     List<Enchere> getEncheresByCategoryId(Long categoryId);

    Map<StatutEnchere, Long> countEncheresByStatus();
    List<Enchere> getEncheresExpiringSoon(LocalDateTime expirationTime);
     List<Enchere> getEncheresByCategorie(Long categorieId);
}