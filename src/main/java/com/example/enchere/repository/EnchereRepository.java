package com.example.enchere.repository;

import com.example.enchere.entities.Enchere;
import com.example.enchere.enums.StatutEnchere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnchereRepository extends JpaRepository<Enchere, Long> {
    List<Enchere> findByProductId(Long productId);
    List<Enchere> findByStatut(StatutEnchere statut);
    @Query("SELECT e FROM Enchere e WHERE e.product.categorie.id = :categorieId ORDER BY e.dateFin ASC")
    List<Enchere> findEncheresByCategorie(@Param("categorieId") Long categorieId);
}



