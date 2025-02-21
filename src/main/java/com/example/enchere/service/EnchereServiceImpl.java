package com.example.enchere.service;

import com.example.enchere.Custom.EnchereDetails;
import com.example.enchere.entities.Participation;
import com.example.enchere.entities.Product;
import com.example.enchere.exception.ResourceNotFoundException;
import com.example.enchere.entities.Enchere;
import com.example.enchere.enums.StatutEnchere;
import com.example.enchere.repository.EnchereRepository;
import com.example.enchere.repository.ParticipationRepository;
import com.example.enchere.service.EnchereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnchereServiceImpl implements EnchereService {

    @Autowired
    private EnchereRepository enchereRepository;

    @Autowired
    private ParticipationRepository participationRepository;
    @Autowired
    private ImageService imageService;

    @Override
    public List<Enchere> getAllEncheres() {
        try {
            // Récupération de toutes les enchères
            List<Enchere> encheres = enchereRepository.findAll();

            // Parcours des enchères pour mettre à jour les URLs des images des produits associés
            for (Enchere enchere : encheres) {
                Product product = enchere.getProduct(); // Produit associé à l'enchère
                if (product != null && product.getImages() != null) { // Vérifie si un chemin d'image est défini
                    String imageUrl = imageService.getPrivateImageUrl("enchere", product.getImages());
                    product.setImages(imageUrl); // Met à jour l'URL d'image
                }
            }

            return encheres;

        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

//    @Override
//    public List<Enchere> getAllEncheres() {
//        return enchereRepository.findAll();
//    }

    @Override
    public Optional<Enchere> getEnchereById(Long id) {
        try {
            // Récupération de l'enchère par ID
            Optional<Enchere> enchereOptional = enchereRepository.findById(id);

            // Si l'enchère existe, mettre à jour l'URL de l'image du produit associé
            enchereOptional.ifPresent(enchere -> {
                Product product = enchere.getProduct();
                if (product != null && product.getImages() != null) {
                    String imageUrl = imageService.getPrivateImageUrl("enchere", product.getImages());
                    product.setImages(imageUrl); // Met à jour l'URL d'image
                }
            });

            return enchereOptional;

        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }
//    @Override
//    public Optional<Enchere> getEnchereById(Long id) {
//
//        return enchereRepository.findById(id);
//    }

    @Override
    public EnchereDetails getEnchereDetailsById(Long id) {
        try {
            // Récupération des participations et de l'enchère
            List<Participation> participations = participationRepository.findByEnchereId(id);
            Optional<Enchere> enchereOptional = enchereRepository.findById(id);

            // Si l'enchère existe, mettre à jour l'URL de l'image du produit associé
            enchereOptional.ifPresent(enchere -> {
                Product product = enchere.getProduct();
                if (product != null && product.getImages() != null) {
                    String imageUrl = imageService.getPrivateImageUrl("enchere", product.getImages());
                    product.setImages(imageUrl); // Met à jour l'URL d'image
                }
            });

            // Retourne un objet `EnchereDetails` avec les participations et l'enchère
            return new EnchereDetails(enchereOptional, participations);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
//    @Override
//    public EnchereDetails getEnchereDetailsById(Long id) {
//        List<Participation> participations = participationRepository.findByEnchereId(id);
//        Optional<Enchere> enchere = enchereRepository.findById(id);
//        return new EnchereDetails(enchere, participations);
//    }


    @Override
    public Enchere saveEnchere(Enchere enchere) {
        enchere.setStatut(StatutEnchere.En_Cours);
        return enchereRepository.save(enchere);
    }

    @Override
    public void deleteEnchere(Long id) {
        enchereRepository.deleteById(id);
    }

    @Override
    public List<Enchere> getEncheresByProductId(Long productId){
        return enchereRepository.findByProductId(productId);
    }
    @Override
    public Enchere updateEnchere(Long id,Enchere enchere) {
        Enchere existingEnchere = enchereRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Enchere not found with id : "+id));
        existingEnchere.setDateDebut(enchere.getDateDebut());
        existingEnchere.setDateFin(enchere.getDateFin());
        existingEnchere.setPrixDepart(enchere.getPrixDepart());
        return enchereRepository.save(existingEnchere);
    }
    @Override
    public Enchere updateStatutEnchere(Long id ,StatutEnchere statut){
        Enchere existingEnchere = enchereRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Enchere not found with id : "+id));
        existingEnchere.setStatut(statut);
        return enchereRepository.save(existingEnchere);
    }
    @Override
    public  List<Enchere> getEncheresByStatut(StatutEnchere statut){
        return enchereRepository.findAll().stream()
                .filter(enchere -> enchere.getStatut().equals(statut))
                .collect(java.util.stream.Collectors.toList());
    }
    @Override
    public List<Enchere> getEncheresByCategoryId(Long categoryId) {
        return enchereRepository.findAll().stream()
                .filter(enchere -> enchere.getProduct().getCategorie().getId().equals(categoryId))
                .collect(java.util.stream.Collectors.toList());
    }
    @Override
    public Map<StatutEnchere, Long> countEncheresByStatus() {
        return enchereRepository.findAll().stream()
                .collect(Collectors.groupingBy(Enchere::getStatut, Collectors.counting()));
    }
    @Override
    public List<Enchere> getEncheresExpiringSoon(LocalDateTime expirationTime) {
        return enchereRepository.findAll().stream()
                .filter(enchere -> enchere.getDateFin().isBefore(expirationTime))
                .collect(Collectors.toList());
    }
    @Override
    public List<Enchere> getEncheresByCategorie(Long categorieId) {
        return enchereRepository.findEncheresByCategorie(categorieId);
    }
}