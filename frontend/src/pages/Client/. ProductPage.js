import React, { useState, useEffect } from 'react';
import ProductFormModal from '../..//components/client/ProductFormModal';
import AuctionModal from '../../components/common/AuctionModal';
import SuccessModal from '../../components/common/SuccessModal';
import apiService from '../../services/apiService';
import '../../../src/ProductPage.css'; // Ajoutez du style ici

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiService.get('/client/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits :', error);
    }
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setShowFormModal(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowFormModal(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await apiService.delete(`/client/products/${id}`);
      setSuccessMessage('Produit supprimé avec succès');
      fetchProducts();
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error);
    }
  };

  const handleLaunchAuction = (product) => {
    setCurrentProduct(product);
    setShowAuctionModal(true);
  };

  const handleFormSubmit = () => {
    setShowFormModal(false);
    setSuccessMessage('Produit enregistré avec succès');
    fetchProducts();
  };

  const handleAuctionSubmit = () => {
    setShowAuctionModal(false);
    setSuccessMessage('Enchère lancée avec succès');
  };

  return (
    <div className="product-page">
      <h1>Gestion des Produits</h1>
      <button className="btn-add" onClick={handleAddProduct}>Ajouter un produit</button>

      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.nomProduit}</h3>
            <p>{product.description}</p>
            <div className="product-actions">
              <button onClick={() => handleEditProduct(product)}>Modifier</button>
              <button onClick={() => handleDeleteProduct(product.id)}>Supprimer</button>
              <button onClick={() => handleLaunchAuction(product)}>Lancer Enchère</button>
            </div>
          </div>
        ))}
      </div>

      {showFormModal && (
        <ProductFormModal
          product={currentProduct}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {showAuctionModal && (
        <AuctionModal
          product={currentProduct}
          onClose={() => setShowAuctionModal(false)}
          onSubmit={handleAuctionSubmit}
        />
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}
    </div>
  );
};

export default ProductPage;
