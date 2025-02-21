package com.example.enchere.controller;

import com.example.enchere.Custom.EnchereDetails;
import com.example.enchere.entities.*;
import com.example.enchere.enums.StatutEnchere;
import com.example.enchere.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "*")
public class ClientController {
    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);
    @Autowired
    private ProductService productService;

    @Autowired
    private EnchereService enchereService;

    @Autowired
    private CategorieService categorieService;

    @Autowired
    private ParticipationService participationService;
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Gestion des produits
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProductsByUserId();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>()); // Retourne une liste vide plutôt qu'une erreur
        }
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@Valid @PathVariable Long id){
        return productService.getProductById(id)
                .map(product -> new ResponseEntity<>(product,HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Gestion des enchères
    @GetMapping("/encheres")
    public ResponseEntity<List<Enchere>> getAllEncheres() {
        return new ResponseEntity<>(enchereService.getAllEncheres(), HttpStatus.OK);
    }


    @GetMapping("/encheres/{id}")
    public ResponseEntity<EnchereDetails> getEnchereById(@Valid @PathVariable Long id) {
        EnchereDetails details = enchereService.getEnchereDetailsById(id);
        if (details.getEnchere().isPresent()) {
            return ResponseEntity.ok(details);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/encheres/category/{categoryId}") //Ajout de cette route
    public ResponseEntity<List<Enchere>> getEncheresByCategoryId(@PathVariable Long categoryId){
        return new ResponseEntity<>(enchereService.getEncheresByCategoryId(categoryId),HttpStatus.OK);
    }
    @GetMapping("/encheres/product/{productId}")
    public ResponseEntity<List<Enchere>> getEncheresByProductId(@Valid @PathVariable Long productId) {
        return new ResponseEntity<>(enchereService.getEncheresByProductId(productId), HttpStatus.OK);
    }
    //    @PostMapping(value = "/Addproducts")
//    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
//        return new ResponseEntity<>(productService.addProduct(product), HttpStatus.CREATED) ;
//    }
    @PostMapping(value = "/Addproducts",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Product> createProduct(@RequestPart("product") Product product, @RequestPart(value="file", required = false) MultipartFile file) throws IOException {
        return new ResponseEntity<>(productService.saveProduct(product,file), HttpStatus.CREATED) ;
    }
    @PutMapping(value = "/products/{id}",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE})
    public  ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestPart("product") Product product,  @RequestPart(value="file", required = false) MultipartFile file, @RequestPart(value="currentImage", required = false) String currentImage, HttpServletRequest request) throws IOException{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        logger.info("The user that is trying to update is: " + currentUserName + " the value of the id is: " + id);
        logger.info("Authentication object : " + authentication.toString());
        logger.info("Request header Authorization: " + request.getHeader("Authorization") );
        logger.info("Product object " + product.toString());
        logger.info("File is present: " + (file!= null));
        logger.info("currentImage " + currentImage);
        return new ResponseEntity<>(productService.updateProductC(id, product,file,currentImage),HttpStatus.OK);
    }
    @PostMapping("/encheres/lancer/{productId}")
    public ResponseEntity<?> lancerEnchere(@PathVariable Long productId,@RequestParam LocalDateTime dateFin) {

        // Vérification que l'utilisateur est authentifié
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Récupérer le nom d'utilisateur de l'authentification

        // Récupérer le produit sélectionné
        Optional<Product> productOptional = productService.getProductById(productId);
        if (!productOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Product product = productOptional.get();

        // Vérifier si une enchère existe déjà pour ce produit
        List<Enchere> existingEncheres = enchereService.getEncheresByProductId(productId);
        if (!existingEncheres.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "An auction already exists for this product.");
            return new ResponseEntity<>(response,HttpStatus.CONFLICT); // Retourne une erreur 409 (Conflit)
        }


        // Créer une nouvelle enchère
        Enchere enchere = new Enchere();
        enchere.setProduct(product);
        enchere.setPrixDepart(product.getPrix()); // Set prixDepart to product's price
        enchere.setDateDebut(LocalDateTime.now()); // Set dateDebut to now
        enchere.setDateFin(dateFin);
        enchere.setStatut(StatutEnchere.En_Cours); // Statut de l'enchère


        // Enregistrer l'enchère dans la base de données
        Enchere createdEnchere = enchereService.saveEnchere(enchere);

        return new ResponseEntity<>(createdEnchere, HttpStatus.CREATED);
    }
//    @PostMapping("/encheres/lancer/{productId}")
//    public ResponseEntity<Enchere> lancerEnchere(
//            @PathVariable Long productId,
//            @RequestParam LocalDateTime dateFin) {
//
//        // Vérification que l'utilisateur est authentifié
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = authentication.getName(); // Récupérer le nom d'utilisateur de l'authentification
//        logger.info("Authentication object : " + authentication);
//        logger.info("User roles: " + authentication.getAuthorities());
//
//        // Verify that you are receiving values of parameters
//        logger.info("value of productId: " + productId);
//        logger.info("value of dateFin: " + dateFin.toString());
//
//        // Récupérer le produit sélectionné
//        Optional<Product> productOptional = productService.getProductById(productId);
//        if (!productOptional.isPresent()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//        Product product = productOptional.get();
//
//        // Vérifier si une enchère existe déjà pour ce produit
//        List<Enchere> existingEncheres = enchereService.getEncheresByProductId(productId);
//        if (!existingEncheres.isEmpty()) {
//            return new ResponseEntity<>(HttpStatus.CONFLICT); // Enchère déjà existante
//        }
//
//
//        // Créer une nouvelle enchère
//        Enchere enchere = new Enchere();
//        enchere.setProduct(product);
//        enchere.setPrixDepart(product.getPrix()); // Set prixDepart to product's price
//        enchere.setDateDebut(LocalDateTime.now()); // Set dateDebut to now
//        enchere.setDateFin(dateFin);
//        enchere.setStatut(StatutEnchere.En_Cours); // Statut de l'enchère
//
//
//        // Enregistrer l'enchère dans la base de données
//        Enchere createdEnchere = enchereService.saveEnchere(enchere);
//
//        return new ResponseEntity<>(createdEnchere, HttpStatus.CREATED);
//    }
//    @PostMapping("/encheres/lancer/{productId}")
//    public ResponseEntity<Enchere> lancerEnchere(@PathVariable Long productId,
//                                                 @RequestParam BigDecimal prixDepart,
//                                                 @RequestParam LocalDateTime dateFin) {
//        // Vérification que l'utilisateur est authentifié
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = authentication.getName(); // Récupérer le nom d'utilisateur de l'authentification
//
//        // Récupérer le produit sélectionné
//        Optional<Product> productOptional = productService.getProductById(productId);
//        if (!productOptional.isPresent()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//        Product product = productOptional.get();
//
//        // Vérifier si une enchère existe déjà pour ce produit
//        List<Enchere> existingEncheres = enchereService.getEncheresByProductId(productId);
//        if (!existingEncheres.isEmpty()) {
//            return new ResponseEntity<>(HttpStatus.CONFLICT); // Enchère déjà existante
//        }
//
//        // Créer une nouvelle enchère
//        Enchere enchere = new Enchere();
//        enchere.setProduct(product);
//        enchere.setPrixDepart(prixDepart);
//        enchere.setDateDebut(LocalDateTime.now());
//        enchere.setDateFin(dateFin);
//        enchere.setStatut(StatutEnchere.En_Cours); // Statut de l'enchère
//
//        // Associer l'enchère à l'utilisateur (facultatif si nécessaire)
//        //  User user = new User(); // Récupérer l'utilisateur authentifié si nécessaire
//        // enchere.setUser(user); // Exemple de liaison avec l'utilisateur
//
//        // Enregistrer l'enchère dans la base de données
//        Enchere createdEnchere = enchereService.saveEnchere(enchere);
//
//        return new ResponseEntity<>(createdEnchere, HttpStatus.CREATED);
//    }

    // Gestion des participations
    @PostMapping("/participations")
    public ResponseEntity<Participation> createParticipation(@RequestBody Participation participation) {
        return new ResponseEntity<>(participationService.saveParticipation(participation), HttpStatus.CREATED);
    }

    @GetMapping("/participations/enchere/{enchereId}")
    public ResponseEntity<List<Participation>> getParticipationsByEnchereId(@PathVariable Long enchereId) {
        return new ResponseEntity<>(participationService.getParticipationsByEnchereId(enchereId), HttpStatus.OK);
    }

    @GetMapping("/participations/user/{userId}")
    public ResponseEntity<List<Participation>> getParticipationsByUserId(@PathVariable Long userId) {
        return new ResponseEntity<>(participationService.getParticipationsByUserId(userId), HttpStatus.OK);
    }

    // Gestion des catégories
    @GetMapping("/categorie/{id}")
    public List<Enchere> getEncheresByCategorie(@PathVariable Long id) {
        return enchereService.getEncheresByCategorie(id);
    }
    @GetMapping("/categories")
    public ResponseEntity<List<Categorie>> getAllCategories() {
        return new ResponseEntity<>(categorieService.getAllCategories(), HttpStatus.OK);
    }

    @DeleteMapping("/Deleteproducts/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/category/{categoryId}")
    public ResponseEntity<List<Participation>> getParticipationsByUserAndCategory(
            @PathVariable Long userId,
            @PathVariable Long categoryId) {
        List<Participation> participations = participationService
                .getParticipationsByUserAndCategorie(userId,categoryId);

        if(participations.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(participations,HttpStatus.OK);
    }
}

//package com.example.enchere.controller;
//
//import com.example.enchere.Custom.EnchereDetails;
//import com.example.enchere.entities.*;
//import com.example.enchere.enums.StatutEnchere;
//import com.example.enchere.service.CategorieService;
//import com.example.enchere.service.EnchereService;
//import com.example.enchere.service.ParticipationService;
//import com.example.enchere.service.ProductService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/client")
//@CrossOrigin(origins = "*")
//public class ClientController {
//    @Autowired
//    private ProductService productService;
//
//    @Autowired
//    private EnchereService enchereService;
//
//    @Autowired
//    private CategorieService categorieService;
//
//    @Autowired
//    private ParticipationService participationService;
//
//    // Gestion des produits
//    @GetMapping("/products")
//    public ResponseEntity<List<Product>> getAllProducts() {
//        try {
//            List<Product> products = productService.getAllProductsByUserId();
//            return ResponseEntity.ok(products);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.ok(new ArrayList<>()); // Retourne une liste vide plutôt qu'une erreur
//        }
//    }
//
//    @GetMapping("/products/{id}")
//    public ResponseEntity<Product> getProductById(@Valid @PathVariable Long id){
//        return productService.getProductById(id)
//                .map(product -> new ResponseEntity<>(product,HttpStatus.OK))
//                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
//    }
//
//    // Gestion des enchères
//    @GetMapping("/encheres")
//    public ResponseEntity<List<Enchere>> getAllEncheres() {
//        return new ResponseEntity<>(enchereService.getAllEncheres(), HttpStatus.OK);
//    }
//
//    @GetMapping("/encheres/{id}")
//    public ResponseEntity<EnchereDetails> getEnchereById(@Valid @PathVariable Long id) {
//        EnchereDetails details = enchereService.getEnchereDetailsById(id);
//        if (details.getEnchere().isPresent()) {
//            return ResponseEntity.ok(details);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @GetMapping("/encheres/product/{productId}")
//    public ResponseEntity<List<Enchere>> getEncheresByProductId(@Valid @PathVariable Long productId) {
//        return new ResponseEntity<>(enchereService.getEncheresByProductId(productId), HttpStatus.OK);
//    }
////    @PostMapping(value = "/Addproducts")
////    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
////        return new ResponseEntity<>(productService.addProduct(product), HttpStatus.CREATED) ;
////    }
//    @PostMapping(value = "/Addproducts",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE})
//    public ResponseEntity<Product> createProduct(@RequestPart("product") Product product, @RequestPart("file") MultipartFile file) throws IOException {
//        return new ResponseEntity<>(productService.saveProduct(product,file), HttpStatus.CREATED) ;
//    }
//    @PutMapping(value = "/products/{id}",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE})
//    public  ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestPart("product") Product product, @RequestPart("file") MultipartFile file) throws IOException{
//        return new ResponseEntity<>(productService.updateProduct(id, product,file),HttpStatus.OK);
//    }
//    @PostMapping("/encheres/lancer/{productId}")
//    public ResponseEntity<Enchere> lancerEnchere(@PathVariable Long productId,
//                                                 @RequestParam BigDecimal prixDepart,
//                                                 @RequestParam LocalDateTime dateFin) {
//        // Vérification que l'utilisateur est authentifié
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = authentication.getName(); // Récupérer le nom d'utilisateur de l'authentification
//
//        // Récupérer le produit sélectionné
//        Optional<Product> productOptional = productService.getProductById(productId);
//        if (!productOptional.isPresent()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//        Product product = productOptional.get();
//
//        // Vérifier si une enchère existe déjà pour ce produit
//        List<Enchere> existingEncheres = enchereService.getEncheresByProductId(productId);
//        if (!existingEncheres.isEmpty()) {
//            return new ResponseEntity<>(HttpStatus.CONFLICT); // Enchère déjà existante
//        }
//
//        // Créer une nouvelle enchère
//        Enchere enchere = new Enchere();
//        enchere.setProduct(product);
//        enchere.setPrixDepart(prixDepart);
//        enchere.setDateDebut(LocalDateTime.now());
//        enchere.setDateFin(dateFin);
//        enchere.setStatut(StatutEnchere.En_Cours); // Statut de l'enchère
//
//        // Associer l'enchère à l'utilisateur (facultatif si nécessaire)
//      //  User user = new User(); // Récupérer l'utilisateur authentifié si nécessaire
//       // enchere.setUser(user); // Exemple de liaison avec l'utilisateur
//
//        // Enregistrer l'enchère dans la base de données
//        Enchere createdEnchere = enchereService.saveEnchere(enchere);
//
//        return new ResponseEntity<>(createdEnchere, HttpStatus.CREATED);
//    }
//
//    // Gestion des participations
//    @PostMapping("/participations")
//    public ResponseEntity<Participation> createParticipation(@RequestBody Participation participation) {
//        return new ResponseEntity<>(participationService.saveParticipation(participation), HttpStatus.CREATED);
//    }
//
//    @GetMapping("/participations/enchere/{enchereId}")
//    public ResponseEntity<List<Participation>> getParticipationsByEnchereId(@PathVariable Long enchereId) {
//        return new ResponseEntity<>(participationService.getParticipationsByEnchereId(enchereId), HttpStatus.OK);
//    }
//
//    @GetMapping("/participations/user/{userId}")
//    public ResponseEntity<List<Participation>> getParticipationsByUserId(@PathVariable Long userId) {
//        return new ResponseEntity<>(participationService.getParticipationsByUserId(userId), HttpStatus.OK);
//    }
//
//    // Gestion des catégories
//    @GetMapping("/categories")
//    public ResponseEntity<List<Categorie>> getAllCategories() {
//        return new ResponseEntity<>(categorieService.getAllCategories(), HttpStatus.OK);
//    }
//
//    @DeleteMapping("/Deleteproducts/{id}")
//    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
//        productService.deleteProduct(id);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    @GetMapping("/user/{userId}/category/{categoryId}")
//    public ResponseEntity<List<Participation>> getParticipationsByUserAndCategory(
//            @PathVariable Long userId,
//            @PathVariable Long categoryId) {
//        List<Participation> participations = participationService
//                .getParticipationsByUserAndCategorie(userId,categoryId);
//
//        if(participations.isEmpty()){
//            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        }
//        return new ResponseEntity<>(participations,HttpStatus.OK);
//    }
//}

//package com.example.enchere.controller;
//import com.example.enchere.entities.*;
//import com.example.enchere.enums.StatutEnchere;
//import com.example.enchere.service.CategorieService;
//import com.example.enchere.service.EnchereService;
//import com.example.enchere.service.ParticipationService;
//import com.example.enchere.service.ProductService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/client")
//@CrossOrigin(origins = "*")
//public class ClientController {
//    @Autowired
//    private ProductService productService;
//
//    @Autowired
//    private EnchereService enchereService;
//    @Autowired
//    private CategorieService categorieService;
//
//    @Autowired
//    private ParticipationService participationService;
//    // Gestion des products
//    @GetMapping("/products")
//    public ResponseEntity<List<Product>> getAllProducts() {
//        try {
//            List<Product> products = productService.getAllProductsByUserId();
//            return ResponseEntity.ok(products);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.ok(new ArrayList<>()); // Retourne une liste vide plutôt qu'une erreur
//        }
//    }
////    @GetMapping("/products")
////    public ResponseEntity<List<Product>> getAllProducts() {
////
////        return productService.getAllProductsByUserId();
////    }
////    @GetMapping("/products")
////    public ResponseEntity<List<Product>> getAllProducts() {
////        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
////    }
//    @GetMapping("/products/{id}")
//    public ResponseEntity<Product> getProductById(@PathVariable Long id){
//        return productService.getProductById(id)
//                .map(product -> new ResponseEntity<>(product,HttpStatus.OK))
//                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
//    }
//    // Gestion des enchères
//    @GetMapping("/encheres")
//    public ResponseEntity<List<Enchere>> getAllEncheres() {
//        return new ResponseEntity<>(enchereService.getAllEncheres(), HttpStatus.OK);
//    }
//    @GetMapping("/encheres/{id}")
//    public ResponseEntity<Enchere> getEnchereById(@PathVariable Long id) {
//        return  enchereService.getEnchereById(id)
//                .map(enchere -> new ResponseEntity<>(enchere,HttpStatus.OK))
//                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
//    }
//    @GetMapping("/encheres/product/{productId}")
//    public  ResponseEntity<List<Enchere>> getEncheresByProductId(@PathVariable Long productId){
//        return new ResponseEntity<>(enchereService.getEncheresByProductId(productId),HttpStatus.OK);
//    }
//    @GetMapping("/encheres/status/{status}")
//    public ResponseEntity<List<Enchere>> getEncheresByStatus(@PathVariable StatutEnchere status){
//        return new ResponseEntity<>(enchereService.getEncheresByStatut(status),HttpStatus.OK);
//    }
//    @PostMapping("/participations")
//    public  ResponseEntity<Participation> createParticipation(@RequestBody Participation participation){
//        return  new ResponseEntity<>(participationService.saveParticipation(participation),HttpStatus.CREATED);
//    }
//    @GetMapping("/participations/enchere/{enchereId}")
//    public  ResponseEntity<List<Participation>> getParticipationsByEnchereId(@PathVariable Long enchereId){
//        return new ResponseEntity<>(participationService.getParticipationsByEnchereId(enchereId),HttpStatus.OK);
//    }
//    @GetMapping("/participations/user/{userId}")
//    public  ResponseEntity<List<Participation>> getParticipationsByUserId(@PathVariable Long userId){
//        return new ResponseEntity<>(participationService.getParticipationsByUserId(userId),HttpStatus.OK);
//    }
//    // Gestion des catégories
//    @GetMapping("/categories")
//    public ResponseEntity<List<Categorie>> getAllCategories() {
//        return new ResponseEntity<>(categorieService.getAllCategories(),HttpStatus.OK);
//    }
//}