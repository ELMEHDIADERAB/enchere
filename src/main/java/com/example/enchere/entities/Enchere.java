package com.example.enchere.entities;


import com.example.enchere.enums.StatutEnchere;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
public class Enchere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private BigDecimal prixDepart;
    @Enumerated(EnumType.STRING)
    private StatutEnchere statut;
    public Enchere() {
    }
    //... Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public BigDecimal getPrixDepart() {
        return prixDepart;
    }

    public void setPrixDepart(BigDecimal prixDepart) {
        this.prixDepart = prixDepart;
    }

    public StatutEnchere getStatut() {
        return statut;
    }

    public void setStatut(StatutEnchere statut) {
        this.statut = statut;
    }
}