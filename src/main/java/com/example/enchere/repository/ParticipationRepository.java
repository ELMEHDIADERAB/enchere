package com.example.enchere.repository;

import com.example.enchere.entities.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByEnchereId(Long enchereId);
    List<Participation> findByUserId(Long userId);
    @Query("SELECT p FROM Participation p " +
            "JOIN p.enchere e " +
            "JOIN e.product prod " +
            "JOIN prod.categorie cat " +
            "WHERE p.user.id = :userId AND cat.id = :categoryId " +
            "ORDER BY p.dateParticipation DESC")
    List<Participation> findParticipationsByUserIdAndCategoryIdOrderByDate(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId
    );
}