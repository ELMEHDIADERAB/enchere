import React, { useState, useMemo ,useEffect} from 'react';
import ProductList from '../../components/client/ProductList';
import ProductForm from '../../components/client/ProductForm';
import useFetch from '../../hooks/useFetch';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../../components/common/Modal';
import apiService from '../../services/apiService';
import EnchereModal from '../../components/client/EnchereModal';
import Pagination from "../../components/common/Pagination";

function ClientProducts() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
     const [isEnchereOpen, setIsEnchereOpen] = useState(false);
     const [enchereProduct, setEnchereProduct] = useState(null);
    const { token } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // Set the number of products to display per page

    const { data: products, loading, error, setData: setProducts } = useFetch('/client/products');
useEffect(() => {
    document.title = 'Mes Produits '; // Titre de la page
  }, []);

      // Calculate the index of the first and last products on the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    // Get the products for the current page
    const currentProducts = products && products.slice(indexOfFirstProduct, indexOfLastProduct);
     // Calculate the total number of pages
    const totalPages = products ? Math.ceil(products.length / productsPerPage) : 0;


      const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
   const paginationMemo = useMemo(()=> (
         <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
           handlePageChange={handlePageChange}
         />
     ),[currentPage, totalPages] )



    const openForm = () => {
        setIsFormOpen(true);
        setEditingProduct(null);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleProductSubmit = async (newProduct, isEditing) => {
    if (isEditing) {
        setProducts(prevProducts =>
            prevProducts.map(prod => prod.id === newProduct.id ? newProduct : prod)
        );
        toast.success('Produit mis à jour avec succès!');
    } else {
        try {
            const response = await apiService.get('/client/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error("Erreur lors du rafraîchissement des produits :", error);
        }
        toast.success('Produit ajouté avec succès!');
    }
    closeForm();
};

    /*const handleProductSubmit = (newProduct, isEditing) => {
        if (isEditing) {
            setProducts(prevProducts =>
                prevProducts.map(prod => prod.id === newProduct.id ? newProduct : prod)
            );
            toast.success('Produit mis à jour avec succès!');
        } else {
            setProducts(prevProducts => [...prevProducts, newProduct]);
            toast.success('Produit ajouté avec succès!');
        }
        closeForm();
    };*/

    const openModal = (product) => {
        setProductToDelete(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setProductToDelete(null);
    };

    const confirmDelete = async () => {
        try {
            const response = await apiService.delete(`/client/Deleteproducts/${productToDelete.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setProducts(prevProducts => prevProducts.filter(product => product.id !== productToDelete.id));
                toast.success('Produit supprimé avec succès!');
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du produit:", error);
            alert('Erreur lors de la suppression du produit. Veuillez réessayer.');
        } finally {
            closeModal();
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

  const openEnchereModal = (product) =>{
        setEnchereProduct(product);
         setIsEnchereOpen(true);
    }
    const closeEnchereModal = () =>{
        setIsEnchereOpen(false)
        setEnchereProduct(null);
    }


    if (loading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="loader"></div>
          </div>
        );
      }
    
     //if (loading) return <div className="text-center p-6">Chargement des produits...</div>;
    if (error) return <div className="text-center p-6 text-red-500">Erreur: {error.message}</div>;



    return (
       <div className="min-h-screen bg-gray-100 py-8" style={{backgroundImage:`url('/images/bg-products.jpg')`, backgroundSize:'cover', backgroundRepeat:'no-repeat'}}>
          <div className="container mx-auto p-6 bg-white bg-opacity-80 rounded-md shadow-lg">
              <ToastContainer />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                     Découvrez Vos Produits
                    </h1>
                    <Button
                        onClick={openForm}
                        className="bg-blue-600 text-white font-semibold hover:bg-green-600 transition-colors duration-300 px-4 py-2 rounded-md"
                    >
                       + Ajouter un Produit
                    </Button>
                </div>
                 <p className="text-gray-600 mb-6">
                     Parcourez votre sélection de produits.
                  </p>
                <ProductList
                    products={currentProducts}
                    onEdit={handleEditProduct}
                    openModal={openModal}
                     openEnchereModal={openEnchereModal}
                />
                <div className="flex justify-center mt-6">
                     {paginationMemo}
                </div>
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-md shadow-lg w-11/12 md:w-2/3">
                            <ProductForm
                                initialProduct={editingProduct}
                                onSubmit={handleProductSubmit}
                                onClose={closeForm}
                            />
                        </div>
                    </div>
                )}
                <ConfirmationModal
                    isOpen={modalOpen}
                    onCancel={closeModal}
                    onConfirm={confirmDelete}
                    message={productToDelete ? `Voulez-vous vraiment supprimer ${productToDelete.nomProduit} ?` : null}
                />
                {enchereProduct && <EnchereModal isOpen={isEnchereOpen} onClose={closeEnchereModal} product={enchereProduct} />}
            </div>
         </div>
    );
}

export default ClientProducts;