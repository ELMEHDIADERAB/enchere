package com.example.enchere.service;

import com.example.enchere.entities.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAllProducts();
    Optional<Product> getProductById(Long id);
    Product saveProduct(Product product, MultipartFile file) throws IOException;
    void deleteProduct(Long id);
    List<Product> getProductsByCategorieId(Long categorieId);
    Product updateProduct(Long id,Product product,MultipartFile file) throws IOException;
    Product updateProductC(Long id, Product product, MultipartFile file, String currentImage) throws IOException;

    //List<Product> getProductsByUserId(Long userId);
    List<Product> getAllProductsByUserId();
    Product addProduct(Product product);
}