package com.example.enchere.config;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.format.Formatter;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Locale;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors ->cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf-> csrf.disable())
                .authorizeHttpRequests(authorize->authorize
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/client/encheres").permitAll()
                        .requestMatchers("/api/client/categories").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/client/Addproducts").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/client/products/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/client/encheres/lancer/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/admin/catrgories/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/admin/**").authenticated()
                        .requestMatchers("/images/**").permitAll()
                        //.requestMatchers("/resources/static/images/**").permitAll()
                        .requestMatchers("/api/client/**").hasAnyRole("CLIENT")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new DateTimeConverter());
    }

    private static class DateTimeConverter implements Formatter<LocalDateTime> {
        @Override
        public LocalDateTime parse(String text, Locale locale) throws ParseException {
            return LocalDateTime.parse(text, DateTimeFormatter.ISO_DATE_TIME);
        }

        @Override
        public String print(LocalDateTime object, Locale locale) {
            return object.format(DateTimeFormatter.ISO_DATE_TIME);
        }

    }

}


//package com.example.enchere.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import java.util.Arrays;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//    @Autowired
//    private UserDetailsService userDetailsService;
//    @Autowired
//    private JwtAuthFilter jwtAuthFilter;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.cors(cors ->cors.configurationSource(corsConfigurationSource()))
//                .csrf(csrf-> csrf.disable())
//                .authorizeHttpRequests(authorize->authorize
//                        .requestMatchers("/api/auth/**").permitAll()
//                        .requestMatchers("/api/client/**").hasRole("CLIENT") // modification
//                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
//                        .anyRequest().authenticated()
//                ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//    @Bean
//    public AuthenticationProvider authenticationProvider(){
//        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
//        authenticationProvider.setUserDetailsService(userDetailsService);
//        authenticationProvider.setPasswordEncoder(passwordEncoder());
//        return authenticationProvider;
//    }
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//    @Bean
//    CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
//        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE"));
//        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//
//}



//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//    @Autowired
//    private UserDetailsService userDetailsService;
//    @Autowired
//    private JwtAuthFilter jwtAuthFilter;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(authorize -> authorize
//                        .requestMatchers("/api/auth/").permitAll()
//                        .requestMatchers("/api/client/").permitAll()
//                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
//                        .anyRequest().authenticated()
//                ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//    @Bean
//    public AuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
//        authenticationProvider.setUserDetailsService(userDetailsService);
//        authenticationProvider.setPasswordEncoder(passwordEncoder());
//        return authenticationProvider;
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
//        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
//        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//}
//
//
////package com.example.enchere.config;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.context.annotation.Bean;
////import org.springframework.context.annotation.Configuration;
////import org.springframework.security.authentication.AuthenticationManager;
////import org.springframework.security.authentication.AuthenticationProvider;
////import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
////import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
////import org.springframework.security.config.annotation.web.builders.HttpSecurity;
////import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
////import org.springframework.security.core.userdetails.UserDetailsService;
////
////import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
////import org.springframework.security.crypto.password.PasswordEncoder;
////import org.springframework.security.web.SecurityFilterChain;
////import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
////import org.springframework.web.cors.CorsConfiguration;
////import org.springframework.web.cors.CorsConfigurationSource;
////import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
////
////import java.util.Arrays;
////
////@Configuration
////@EnableWebSecurity
////public class SecurityConfig {
////    @Autowired
////    private UserDetailsService userDetailsService;
////    @Autowired
////    private JwtAuthFilter jwtAuthFilter;
////
////    @Bean
////    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
////                .csrf(csrf -> csrf.disable())
////                .authorizeHttpRequests(authorize -> authorize
////                        .requestMatchers("/api/auth/").permitAll()
////                        .requestMatchers("/api/client/").permitAll()
////                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
////                        .anyRequest().authenticated()
////                ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
////        return http.build();
////    }
////
////    @Bean
////    public AuthenticationProvider authenticationProvider() {
////        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
////        authenticationProvider.setUserDetailsService(userDetailsService);
////        authenticationProvider.setPasswordEncoder(passwordEncoder());
////        return authenticationProvider;
////    }
////
////    @Bean
////    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
////        return config.getAuthenticationManager();
////    }
////
////    @Bean
////    public PasswordEncoder passwordEncoder() {
////        return new BCryptPasswordEncoder();
////    }
////
////    @Bean
////    CorsConfigurationSource corsConfigurationSource() {
////        CorsConfiguration configuration = new CorsConfiguration();
////        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
////        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
////        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        source.registerCorsConfiguration("/**", configuration);
////        return source;
////    }
////}
////
////
//////package com.example.enchere.config;
//////
//////import org.springframework.beans.factory.annotation.Autowired;
//////import org.springframework.context.annotation.Bean;
//////import org.springframework.context.annotation.Configuration;
//////import org.springframework.security.authentication.AuthenticationManager;
//////import org.springframework.security.authentication.AuthenticationProvider;
//////import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//////import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//////import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//////import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//////import org.springframework.security.core.userdetails.UserDetailsService;
//////import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//////import org.springframework.security.crypto.password.PasswordEncoder;
//////import org.springframework.security.web.SecurityFilterChain;
//////import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//////import org.springframework.web.cors.CorsConfiguration;
//////import org.springframework.web.cors.CorsConfigurationSource;
//////import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//////
//////import java.util.Arrays;
//////
//////@Configuration
//////@EnableWebSecurity
//////public class SecurityConfig {
//////    @Autowired
//////    private UserDetailsService userDetailsService;
//////    @Autowired
//////    private JwtAuthFilter jwtAuthFilter;
//////    @Bean
//////    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//////        http.cors(cors ->cors.configurationSource(corsConfigurationSource()))
//////                .csrf(csrf-> csrf.disable())
//////                .authorizeHttpRequests(authorize->authorize
//////                        .requestMatchers("/api/auth/**").permitAll()
//////                        .requestMatchers("/api/client/**").permitAll()
//////                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
//////                        .anyRequest().authenticated()
//////                ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//////
//////        return http.build();
//////    }
//////    @Bean
//////    public AuthenticationProvider authenticationProvider(){
//////        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
//////        authenticationProvider.setUserDetailsService(userDetailsService);
//////        authenticationProvider.setPasswordEncoder(passwordEncoder());
//////        return authenticationProvider;
//////    }
//////    @Bean
//////    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//////        return config.getAuthenticationManager();
//////    }
//////    @Bean
//////    public PasswordEncoder passwordEncoder() {
//////        return new BCryptPasswordEncoder();
//////    }
//////    @Bean
//////    CorsConfigurationSource corsConfigurationSource() {
//////        CorsConfiguration configuration = new CorsConfiguration();
//////        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
//////        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE"));
//////        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
//////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//////        source.registerCorsConfiguration("/**", configuration);
//////        return source;
//////    }
//////}