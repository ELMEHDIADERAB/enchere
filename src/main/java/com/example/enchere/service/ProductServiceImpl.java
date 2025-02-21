package com.example.enchere.service;

import com.example.enchere.entities.Product;
import com.example.enchere.entities.User;
import com.example.enchere.exception.ResourceNotFoundException;
import com.example.enchere.repository.ProductRepository;
import com.example.enchere.repository.UserRepository;
import com.example.enchere.service.ProductService;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.util.StringUtils;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.*;
import io.minio.http.Method;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private MinioClient minioClient;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ImageService imageService;
    @Autowired
    private UserRepository userRepository;
    private final String UPLOAD_DIR = "public/images/";

//    @Override
//    public List<Product> getAllProducts() {
//        return productRepository.findAll();
//    }
@Override
public List<Product> getAllProducts() {
    try {
    List<Product> products = productRepository.findAll();
    //Pour itérer sur l'enssemble des produits et récupérer le nom d'utilisateur
    for (Product product : products){
        if(product.getUser()!=null  && product.getImages() != null){
            String nomUtilisateur = product.getUser().getNomUtilisateur(); //on récupere le nom d'utilisateur de l'entité user
            System.out.println(nomUtilisateur);
            String imageUrl = imageService.getPrivateImageUrl("enchere", product.getImages());
            product.setImages(imageUrl); // Assurez-vous que la classe Product a un champ imageUrl
        }

    }
    return products;
} catch (Exception e) {
        e.printStackTrace();
        return List.of();
    }
}

    @Override
    public List<Product> getAllProductsByUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !"anonymousUser".equals(authentication.getName())) {

                // Récupérer les détails de l'utilisateur
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                User user = userRepository.findByEmail(userDetails.getUsername())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + userDetails.getUsername()));

                // Récupérer tous les produits de l'utilisateur
                List<Product> products = productRepository.findAllProductsByUserId(user.getId());

                // Générer les URLs des images pour chaque produit
                for (Product product : products) {
                    if (product.getImages() != null) {
                        String imageUrl = imageService.getPrivateImageUrl("enchere", product.getImages());
                        product.setImages(imageUrl); // Assurez-vous que la classe Product a un champ imageUrl
                    }
                }

                return products;
            }
            return List.of();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }
//    @Override
//    public List<Product> getAllProductsByUserId() {
//        try{
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            if (authentication != null && authentication.isAuthenticated() &&
//                    !"anonymousUser".equals(authentication.getName())) {
//                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//                User user = userRepository.findByEmail(userDetails.getUsername())
//                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + userDetails.getUsername()));
//                return productRepository.findAllProductsByUserId(user.getId());
//            }
//            return List.of();
//        } catch (Exception e) {
//            e.printStackTrace();
//            return List.of();
//        }
//    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }
//    @Override
//    public Product saveProduct(Product product,MultipartFile file) throws IOException{
//        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
//        Path path = Paths.get(UPLOAD_DIR, filename);
//        Files.write(path,file.getBytes());
//        product.setImages("/images/" + filename);
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = authentication.getName(); // Get username from authentication
//        User user = userRepository.findByEmail(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + username));
//        product.setUser(user);
//        return productRepository.save(product);
//    }
@Override
public Product saveProduct(Product product, MultipartFile file) throws IOException {
    // Vérifier si le fichier n'est pas vide
    if (!file.isEmpty()) {
        // Générer un nom unique pour le fichier
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // Ajouter l'image via le service MinIO
        String cheminImage = imageService.addImage(product, file);

        // Vérifier si l'image a été enregistrée avec succès
        if (cheminImage == null) {
            throw new IOException("Erreur lors de l'enregistrement de l'image");
        }

        // Associer le chemin de l'image au produit
        product.setImages(cheminImage);
    }

    // Obtenir l'utilisateur authentifié
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName(); // Récupérer le nom d'utilisateur depuis l'authentification
    User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + username));

    // Associer l'utilisateur au produit
    product.setUser(user);

    // Enregistrer le produit dans la base de données
    return productRepository.save(product);
}

    @Override
    public List<Product> getProductsByCategorieId(Long categorieId) {
        return productRepository.findByCategorieId(categorieId);
    }
    @Override
    public Product updateProduct(Long id, Product product,MultipartFile file) throws IOException{
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Product not found with id : "+id));
        existingProduct.setNomProduit(product.getNomProduit());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrix(product.getPrix());
        existingProduct.setCategorie(product.getCategorie());
        if(file !=null && !file.isEmpty()){
            String fileName = saveImage(file);
            existingProduct.setImages(fileName);

        }
        return productRepository.save(existingProduct);


    }
    @Override
    public Product updateProductC(Long id, Product product, MultipartFile file, String currentImage) throws IOException {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (file != null && !file.isEmpty()) {
            long maxSize = 2 * 1024 * 1024; // Limite de 2 Mo
            if (file.getSize() > maxSize) {
                throw new RuntimeException("La taille de l'image ne peut pas dépasser 2 Mo.");
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String destinationPath = "products/" + filename; // Dossier MinIO pour les produits

            try {
                // Enregistrer l'image sur MinIO
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket("enchere") // Nom du bucket
                                .object(destinationPath) // Chemin de destination
                                .stream(file.getInputStream(), file.getSize(), -1)
                                .build()
                );
                existingProduct.setImages(destinationPath); // Mettre à jour le chemin de l'image
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Erreur lors de l'enregistrement de l'image sur MinIO.", e);
            }
        } else if (currentImage != null) {
            existingProduct.setImages(currentImage);
        }

        // Mettre à jour les autres champs du produit
        existingProduct.setNomProduit(product.getNomProduit());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrix(product.getPrix());
        existingProduct.setCategorie(product.getCategorie());

        return productRepository.save(existingProduct);
    }

//    @Override
//    public Product updateProductC(Long id, Product product, MultipartFile file, String currentImage) throws IOException {
//        Product existingProduct = productRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
//
//        if (file != null && !file.isEmpty()) {
//            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
//            Path path = Paths.get(UPLOAD_DIR, filename);
//            Files.write(path, file.getBytes());
//            existingProduct.setImages("/images/" + filename);
//        } else if (currentImage != null) {
//            existingProduct.setImages(currentImage);
//        }
//        existingProduct.setNomProduit(product.getNomProduit());
//        existingProduct.setDescription(product.getDescription());
//        existingProduct.setPrix(product.getPrix());
//        existingProduct.setCategorie(product.getCategorie());
//
//        return productRepository.save(existingProduct);
//    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public String saveImage(MultipartFile file) throws IOException{
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = UUID.randomUUID()+fileExtension;
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if(!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(),filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }
}

//package com.example.enchere.service;
//
//import com.example.enchere.config.CustomUserDetails;
//import com.example.enchere.exception.ResourceNotFoundException;
//import com.example.enchere.entities.Product;
//import com.example.enchere.repository.ProductRepository;
//import com.example.enchere.service.ProductService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import org.springframework.util.StringUtils;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardCopyOption;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//public class ProductServiceImpl implements ProductService {
//
//    @Autowired
//    private ProductRepository productRepository;
//    //private final String UPLOAD_DIR = "src/main/resources/static/images";
//    private final String UPLOAD_DIR = "public/images/";
////    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
////    Long userId =  Long.valueOf(authentication.getName());
//
//    @Override
//    public List<Product> getAllProducts() {
//        return productRepository.findAll();
//    }
//
//    @Override
//    public Optional<Product> getProductById(Long id) {
//        return productRepository.findById(id);
//    }
//
//    @Override
//    public Product saveProduct(Product product,MultipartFile file) throws IOException {
//        String fileName = saveImage(file);
//        product.setImages("/images/" + fileName);
//        product.setDateAjout(LocalDateTime.now());
//        return productRepository.save(product);
//    }
//
//    @Override
//    public void deleteProduct(Long id) {
//        productRepository.deleteById(id);
//    }
//    @Override
//    public List<Product> getProductsByCategorieId(Long categorieId) {
//        return productRepository.findByCategorieId(categorieId);
//    }
//
//    @Override
//    public Product updateProductC(Long id, Product product, MultipartFile file, String currentImage) throws IOException {
//        Product existingProduct = productRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
//
//        if (file != null && !file.isEmpty()) {
//            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
//            Path path = Paths.get("src/main/resources/static/images", filename);
//            Files.write(path, file.getBytes());
//            existingProduct.setImages(filename);
//        }else if(currentImage!= null){
//            existingProduct.setImages(currentImage);
//
//        }
//
//        existingProduct.setNomProduit(product.getNomProduit());
//        existingProduct.setDescription(product.getDescription());
//        existingProduct.setPrix(product.getPrix());
//        existingProduct.setCategorie(product.getCategorie());
//
//
//        return productRepository.save(existingProduct);
//
//    }
//    @Override
//    public Product updateProduct(Long id, Product product,MultipartFile file) throws IOException{
//        Product existingProduct = productRepository.findById(id)
//                .orElseThrow(()-> new ResourceNotFoundException("Product not found with id : "+id));
//        existingProduct.setNomProduit(product.getNomProduit());
//        existingProduct.setDescription(product.getDescription());
//        existingProduct.setPrix(product.getPrix());
//        existingProduct.setCategorie(product.getCategorie());
//        if(file !=null && !file.isEmpty()){
//            String fileName = saveImage(file);
//            existingProduct.setImages(fileName);
//
//        }
//        return productRepository.save(existingProduct);
//
//
//    }
//
//    @Override
//    public List<Product> getAllProductsByUserId() {
//        try {
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//            // Si l'utilisateur est authentifié
//            if (authentication != null && authentication.isAuthenticated() &&
//                    !"anonymousUser".equals(authentication.getName())) {
//
//                // Récupérer l'utilisateur connecté depuis les détails de sécurité
//                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//                Long userId = userDetails.getId(); // Assurez-vous que CustomUserDetails contient l'ID utilisateur
//
//                return productRepository.findAllProductsByUserId(userId);
//            }
//
//            // Si non authentifié, retourner une liste vide
//            return new ArrayList<>();
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            // Retourner une liste vide en cas d'erreur
//            return new ArrayList<>();
//        }
//    }
//
//    @Override
//    public Product addProduct(Product product) {
//        product.setDateAjout(LocalDateTime.now());
//        return productRepository.save(product);
//    }
//
////    @Override
////    public List<Product> getAllProductsByUserId() {
////        try {
////            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
////
////            // Si l'utilisateur est authentifié
////            if (authentication != null && authentication.isAuthenticated() &&
////                    !"anonymousUser".equals(authentication.getName())) {
////
////                // Récupérer l'ID de l'utilisateur du token
////                Long userId = Long.valueOf(authentication.getName());
////                return productRepository.findAllProductsByUserId(userId);
////            }
////
////            // Si non authentifié, retourner une liste vide
////            return new ArrayList<>();
////
////        } catch (Exception e) {
////            e.printStackTrace();
////            // Retourner une liste vide en cas d'erreur
////            return new ArrayList<>();
////        }
////    }
//
//    public String saveImage(MultipartFile file) throws IOException{
//        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
//        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
//        String fileName = UUID.randomUUID()+fileExtension;
//        Path uploadPath = Paths.get(UPLOAD_DIR);
//        if(!Files.exists(uploadPath)){
//            Files.createDirectories(uploadPath);
//        }
//        Path filePath = uploadPath.resolve(fileName);
//        Files.copy(file.getInputStream(),filePath, StandardCopyOption.REPLACE_EXISTING);
//        return fileName;
//    }
//}