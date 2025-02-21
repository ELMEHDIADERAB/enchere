package com.example.enchere.config;
import com.example.enchere.exception.ResourceNotFoundException;
import com.example.enchere.entities.User;
import com.example.enchere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("loadUserByUsername : " + email);
        User user =  userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email : "+email));
        System.out.println("Role : " + user.getRole().getNomRole()); //Ajout de ce log

        return new CustomUserDetails(user); //Verifier l'import de CustomUserDetails
    }
}