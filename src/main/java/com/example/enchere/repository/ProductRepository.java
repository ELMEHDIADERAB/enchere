package com.example.enchere.repository;
import com.example.enchere.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategorieId(Long categorieId);
    List<Product> findAllProductsByUserId(Long userId);
}