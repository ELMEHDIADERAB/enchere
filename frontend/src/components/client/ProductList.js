import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, onDelete, onEdit, openModal, openEnchereModal }) {
  return (
      <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products && products.map(product => (
                  <ProductCard
                      key={product.id}
                      product={product}
                      onDelete={onDelete}
                      onEdit={onEdit}
                       openModal={openModal}
                        openEnchereModal={openEnchereModal}
                  />
              ))}
          </div>
      </div>
  );
}

export default ProductList;