package com.example.enchere.controller;

import com.example.enchere.entities.Categorie;
import com.example.enchere.entities.Enchere;
import com.example.enchere.entities.Product;
import com.example.enchere.entities.RoleUtilisateur;
import com.example.enchere.entities.User;
import com.example.enchere.enums.StatutEnchere;
import com.example.enchere.service.CategorieService;
import com.example.enchere.service.EnchereService;
import com.example.enchere.service.ProductService;
import com.example.enchere.service.RoleUtilisateurService;
import com.example.enchere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleUtilisateurService roleUtilisateurService;

    @Autowired
    private CategorieService categorieService;
    @Autowired
    private ProductService productService;
    @Autowired
    private EnchereService enchereService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Gestion des utilisateurs
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/users/activate/{id}")
    public  ResponseEntity<User> activateUser(@PathVariable Long id){
        return new ResponseEntity<>(userService.activateUser(id),HttpStatus.OK);
    }

    @PutMapping("/users/deactivate/{id}")
    public  ResponseEntity<User> deactivateUser(@PathVariable Long id){
        return new ResponseEntity<>(userService.deactivateUser(id),HttpStatus.OK);
    }
    @PutMapping("/users/{id}")
    public  ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user){
        return new ResponseEntity<>(userService.updateUser(id, user),HttpStatus.OK);
    }
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        System.out.println("Création de l'utilisateur : " + user);
        return new ResponseEntity<>(userService.saveUser(user), HttpStatus.CREATED);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping("/users/me")
    public User updateUserProfile(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody User updatedUser) {

        // Vérifie que l'utilisateur ne modifie pas son rôle
        updatedUser.setRole(authenticatedUser.getRole());

        // Vérifie si le mot de passe est renseigné et l'encode avant la mise à jour
        if (updatedUser.getMotDePasse() != null && !updatedUser.getMotDePasse().isEmpty()) {
            updatedUser.setMotDePasse(passwordEncoder.encode(updatedUser.getMotDePasse()));
        } else {
            // Garde l'ancien mot de passe si l'utilisateur ne le modifie pas
            updatedUser.setMotDePasse(authenticatedUser.getMotDePasse());
        }

        return userService.UpdateUserProfile(authenticatedUser.getId(), updatedUser);
    }

    // Gestion des rôles
    @GetMapping("/roles")
    public ResponseEntity<List<RoleUtilisateur>> getAllRoles() {
        return new ResponseEntity<>(roleUtilisateurService.getAllRoles(),HttpStatus.OK);
    }

    @GetMapping("/roles/{id}")
    public ResponseEntity<RoleUtilisateur> getRoleById(@PathVariable Long id) {
        return  roleUtilisateurService.getRoleById(id)
                .map(role -> new ResponseEntity<>(role,HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/roles")
    public ResponseEntity<RoleUtilisateur> createRole(@RequestBody RoleUtilisateur roleUtilisateur){
        return new ResponseEntity<>(roleUtilisateurService.saveRole(roleUtilisateur),HttpStatus.CREATED);
    }

    @PutMapping("/roles/{id}")
    public ResponseEntity<RoleUtilisateur> updateRole(@PathVariable Long id , @RequestBody RoleUtilisateur roleUtilisateur){
        return roleUtilisateurService.getRoleById(id)
                .map(role ->{
                    role.setNomRole(roleUtilisateur.getNomRole());
                    return new ResponseEntity<>(roleUtilisateurService.saveRole(role),HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @DeleteMapping("/roles/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleUtilisateurService.deleteRole(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Gestion des catégories
    @GetMapping("/categories")
    public ResponseEntity<List<Categorie>> getAllCategories() {
        return new ResponseEntity<>(categorieService.getAllCategories(),HttpStatus.OK);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Categorie> getCategorieById(@PathVariable Long id){
        return  categorieService.getCategorieById(id)
                .map(categorie -> new ResponseEntity<>(categorie,HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @PostMapping("/categories")
    public  ResponseEntity<Categorie> createCategorie(@RequestBody Categorie categorie){
        return  new ResponseEntity<>(categorieService.saveCategorie(categorie),HttpStatus.CREATED);
    }
    @PutMapping("/categories/{id}")
    public  ResponseEntity<Categorie> updateCategorie(@PathVariable Long id,@RequestBody Categorie categorie){
        return  categorieService.getCategorieById(id)
                .map(existingCategorie -> {
                    existingCategorie.setNomCategorie(categorie.getNomCategorie());
                    return new ResponseEntity<>(categorieService.saveCategorie(existingCategorie),HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/categories/{id}")
    public  ResponseEntity<Void> deleteCategorie(@PathVariable Long id){
        categorieService.deleteCategorie(id);
        return  new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    // Gestion des products
    @GetMapping("/products")
    public  ResponseEntity<List<Product>> getAllProducts(){
        return new ResponseEntity<>(productService.getAllProducts(),HttpStatus.OK);
    }
//    @GetMapping("/products")
//    public ResponseEntity<List<Product>> getAllProducts() {
//        List<Product> products = productService.getAllProducts();
//        return new ResponseEntity<>(products, HttpStatus.OK);
//    }

    @GetMapping("/products/{id}")
    public  ResponseEntity<Product> getProductById(@PathVariable Long id){
        return  productService.getProductById(id)
                .map(product -> new ResponseEntity<>(product,HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @PostMapping(value = "/products",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Product> createProduct(@RequestPart("product") Product product, @RequestPart("file") MultipartFile file) throws IOException {
        return new ResponseEntity<>(productService.saveProduct(product,file), HttpStatus.CREATED) ;
    }
    @PutMapping(value = "/products/{id}",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE})
    public  ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestPart("product") Product product, @RequestPart("file") MultipartFile file) throws IOException{
        return new ResponseEntity<>(productService.updateProduct(id, product,file),HttpStatus.OK);
    }
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    // Gestion des enchères
    @GetMapping("/encheres")
    public ResponseEntity<List<Enchere>> getAllEncheres() {
        return new ResponseEntity<>(enchereService.getAllEncheres(), HttpStatus.OK);
    }

    @GetMapping("/encheres/{id}")
    public ResponseEntity<Enchere> getEnchereById(@PathVariable Long id) {
        return  enchereService.getEnchereById(id)
                .map(enchere -> new ResponseEntity<>(enchere,HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @GetMapping("/encheres/product/{productId}")
    public  ResponseEntity<List<Enchere>> getEncheresByProductId(@PathVariable Long productId){
        return new ResponseEntity<>(enchereService.getEncheresByProductId(productId),HttpStatus.OK);
    }
    @PutMapping("/encheres/{id}/status/{status}")
    public ResponseEntity<Enchere> updateStatutEnchere(@PathVariable Long id,@PathVariable StatutEnchere status){
        return new ResponseEntity<>(enchereService.updateStatutEnchere(id, status),HttpStatus.OK);
    }
    @GetMapping("/encheres/countByStatus") //Nouvelle route
    public ResponseEntity<Map<StatutEnchere, Long>> countEncheresByStatus() {
        return new ResponseEntity<>(enchereService.countEncheresByStatus(), HttpStatus.OK);
    }
    @GetMapping("/encheres/expiringSoon") // Nouvelle route pour les enchères expirant bientôt
    public ResponseEntity<List<Enchere>> getEncheresExpiringSoon() {
        LocalDateTime expirationTime = LocalDateTime.now().plusHours(24);
        return new ResponseEntity<>(enchereService.getEncheresExpiringSoon(expirationTime), HttpStatus.OK);
    }
}
