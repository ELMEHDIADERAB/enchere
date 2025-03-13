import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import EnchereModal from "./EnchereModal";

function ProductCard({ product, onDelete, onEdit, openModal }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEnchereOpen, setIsEnchereOpen] = useState(false);
    const baseUrl = 'http://localhost:8083';

    const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      }
  }, [menuRef])
  
 const formatPrice = (price) => {
        try {
            const formattedPrice = new Intl.NumberFormat('fr-MA', {
                 style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(price);
            return `${formattedPrice} MAD`;
          } catch (error) {
            console.error("Error formatting price:", error);
            return `${price} MAD`;
        }
  };

   const openEnchereModal = () =>{
        setIsEnchereOpen(true)
    }
    const closeEnchereModal = () =>{
        setIsEnchereOpen(false)
   }

   return (
        <div className="product-card p-4 bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="relative">
               <div className="relative">
               {product.images && (
            <>
             {console.log("The value of the image src ",  product.images.startsWith('http') ? product.images : `${baseUrl}/images/${product.images}`)}
             <img
              src={ product.images.startsWith('http') ? product.images : `${baseUrl}/images/${product.images}` }
                alt={product.nomProduit}
                className="w-full h-48 object-cover rounded-t-lg"
           />
                         </>
                    )}
                  <div className="absolute top-2 right-2" ref={menuRef}>
                        <button
                             onClick={() => setIsMenuOpen(!isMenuOpen)}
                           className="text-gray-500 hover:text-gray-700 focus:outline-none focus:shadow-outline p-1"
                         >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" >
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                         </button>
                            {isMenuOpen && (
                            <div className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-md shadow-lg z-10">
                                    <button
                                      onClick={() => onEdit(product)}
                                       className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                                  >
                                         Modifier
                                    </button>
                                   <button
                                        onClick={() => openModal(product)}
                                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                                     >
                                      Supprimer
                                   </button>
                            </div>
                           )}
                   </div>
               </div>

            </div>
            <div className="p-4">
                <h3 className="font-semibold text-xl text-gray-800 mt-2 mb-1 line-clamp-2">
                    {product.nomProduit}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-3">
                    {product.description}
                </p>
                <p className="font-bold text-xl text-green-600 mb-3">
                    {formatPrice(product.prix)}
                </p>
                 <Button
                    onClick={openEnchereModal}
                      className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition duration-300"
                  >
                     Lancer en Enchère
                  </Button>
             </div>
               <EnchereModal isOpen={isEnchereOpen} onClose={closeEnchereModal} product={product} />
        </div>
    );
}

export default ProductCard;
/*import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import EnchereModal from "./EnchereModal";

function ProductCard({ product, onDelete, onEdit, openModal }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEnchereOpen, setIsEnchereOpen] = useState(false);

    const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      }
  }, [menuRef])
  
 const formatPrice = (price) => {
        try {
            const formattedPrice = new Intl.NumberFormat('fr-MA', {
                 style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(price);
            return `${formattedPrice} MAD`;
          } catch (error) {
            console.error("Error formatting price:", error);
            return `${price} MAD`;
        }
  };

   const openEnchereModal = () =>{
        setIsEnchereOpen(true)
    }
    const closeEnchereModal = () =>{
        setIsEnchereOpen(false)
   }

   return (
        <div className="product-card p-4 bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="relative">
               <div className="relative">
                    {product.images && (
                    <img
                        src={product.images}
                        alt={product.nomProduit}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                )}
                  <div className="absolute top-2 right-2" ref={menuRef}>
                        <button
                             onClick={() => setIsMenuOpen(!isMenuOpen)}
                           className="text-gray-500 hover:text-gray-700 focus:outline-none focus:shadow-outline p-1"
                         >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" >
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                         </button>
                            {isMenuOpen && (
                            <div className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-md shadow-lg z-10">
                                    <button
                                      onClick={() => onEdit(product)}
                                       className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                                  >
                                         Modifier
                                    </button>
                                   <button
                                        onClick={() => openModal(product)}
                                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                                     >
                                      Supprimer
                                   </button>
                            </div>
                           )}
                   </div>
               </div>

            </div>
            <div className="p-4">
                <h3 className="font-semibold text-xl text-gray-800 mt-2 mb-1 line-clamp-2">
                    {product.nomProduit}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-3">
                    {product.description}
                </p>
                <p className="font-bold text-xl text-green-600 mb-3">
                    {formatPrice(product.prix)}
                </p>
                 <Button
                    onClick={openEnchereModal}
                      className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition duration-300"
                  >
                     Lancer en Enchère
                  </Button>
                  <EnchereModal isOpen={isEnchereOpen} onClose={closeEnchereModal} product={product} />
             </div>
        </div>
    );
}

export default ProductCard;*/

/*import React from 'react';

function ProductCard({ product, onDelete, onEdit, openModal }) {
  console.log("Product image path", product.images);
    const formatPrice = (price) => {
        try {
            const formattedPrice = new Intl.NumberFormat('fr-MA', {
                 style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(price);
            return `${formattedPrice} MAD`;
          } catch (error) {
            console.error("Error formatting price:", error);
            return `${price} MAD`; // Default to string conversion if an error occurs
        }
  };

  return (
    <div className="product-card p-4 bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="relative">
        {product.images && (
          <img
            src={product.images}
            alt={product.nomProduit}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-xl text-gray-800 mt-2 mb-1 line-clamp-2">
          {product.nomProduit}
        </h3>
        <p className="text-gray-600 mb-3 line-clamp-3">
          {product.description}
        </p>
        <p className="font-bold text-xl text-green-600 mb-3">
          {formatPrice(product.prix)}
        </p>
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onEdit(product)}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Modifier
          </button>
          <button
            onClick={() => openModal(product)}
             className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;*/