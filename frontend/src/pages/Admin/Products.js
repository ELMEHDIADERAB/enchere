import React, { useState, useEffect } from 'react';
    import useFetch from "../../hooks/useFetch";
   import Button from "../../components/common/Button";
    import apiService from '../../services/apiService';

    function Products() {
        const [currentPage, setCurrentPage] = useState(1);
        const productsPerPage = 5;
        const { data: products , loading , error } = useFetch("/admin/products");
        useEffect(() => {
            document.title = 'Dashboard - Produits'; // Titre de la page
          }, []);

        if(loading){
            return <div>Loading products ...</div>
        }
        if(error){
            return <div>Error : {error.message}</div>
        }

         // Calculate the index of the first and last products on the current page
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        // Get the products for the current page
        const currentProducts = products?.slice(indexOfFirstProduct, indexOfLastProduct)

       // Calculate the total number of pages
       const totalPages = products ? Math.ceil(products.length / productsPerPage) : 0;

        const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
        };

       const renderPageNumbers = () => {
            const pageNumbers = [];
           for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                       onClick={() => handlePageChange(i)}
                        className={`mx-1 px-3 py-1 rounded-md transition duration-300
                             ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        {i}
                   </button>
              );
          }
            return pageNumbers;
       };
        const baseUrl = 'http://localhost:9000/enchere';
        return (
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Liste des produits</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-md">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Nom </th>
                                 <th className="py-2 px-4 border-b">Image</th>{/*Header Img*/}
                                 <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Prix</th>
                                 <th className="py-2 px-4 border-b">Ajouter par</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts && currentProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                     <td className="py-2 px-4 border-b">{product.id}</td>
                                    <td className="py-2 px-4 border-b">{product.nomProduit}</td>
                                     <td className="py-2 px-4 border-b">  {/*Affichage de l'image dans le tableau*/}
                                            {product.images && (
                                                <img
                                                src={ product.images.startsWith('http') ? product.images : `${baseUrl}/images/${product.images}` }
                                                    alt={product.images}
                                                    className="w-20 h-20 object-cover rounded"
                                                 />
                                            )}
                                       </td>
                                     <td className="py-2 px-4 border-b">{product.description}</td>
                                    <td className="py-2 px-4 border-b">{product.prix}</td>
                                     <td className="py-2 px-4 border-b">{product.user?.nom}  {product.user?.prenom}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  <div className="flex justify-center mt-6">
                        {renderPageNumbers()}
                    </div>
              </div>
            </div>
        );
    }

    export default Products;