package com.example.enchere.controller;

import com.example.enchere.config.CustomUserDetails;
import com.example.enchere.config.JwtUtil;
import com.example.enchere.entities.RoleUtilisateur;
import com.example.enchere.entities.User;
import com.example.enchere.service.RoleUtilisateurService;
import com.example.enchere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    @Autowired
    private UserService userService;
    @Autowired
    private RoleUtilisateurService roleUtilisateurService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        try {
            // Affectation du rôle client par défaut
            RoleUtilisateur role =roleUtilisateurService.getRoleById(2L).orElse(null);// Le rôle par défaut
            user.setRole(role);
            user.setActive(true);
            user.setDateInscription(LocalDateTime.now());

            // Enregistrer l'utilisateur
            User savedUser = userService.saveUser(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Inscription réussie, vous pouvez vous connecter maintenant");
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Erreur lors de l'inscription : " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> authenticateUser(@RequestBody User user) {
        System.out.println("Tentative de connexion avec l'utilisateur : " + user.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getMotDePasse())
            );
            CustomUserDetails userD = (CustomUserDetails) authentication.getPrincipal();
            Long userId = userD.getId();

            if(authentication.isAuthenticated()){
                System.out.println("L'authentification réussit pour l'utilisateur :" + user.getEmail());
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                String token = jwtUtil.generateToken(userDetails);
                Map<String, String> response = new HashMap<>();
                response.put("token",token);
                response.put("user", String.valueOf(userId));
                response.put("role",userDetails.getAuthorities().toString()); //Récupérer le role
                response.put("message","login successful");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }else {
                System.out.println("L'authentification échoue pour l'utilisateur : " + user.getEmail() );
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } catch(AuthenticationException e) {
            System.out.println("Exception d'authentification pour l'utilisateur : " + user.getEmail() + " : " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

    }
}
