import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetch from '../../hooks/useFetch';
import apiService from '../../services/apiService';

const Categories = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  const { data: categories, loading, error, setData: setCategories } = useFetch('/admin/categories');
  useEffect(() => {
    document.title = 'Dashboard - Gestion des Catégories'; // Titre de la page
  }, []);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories?.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = categories ? Math.ceil(categories.length / categoriesPerPage) : 0;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  

  const handleCategorySubmit = async (formData) => {
    try {
      let response;
      const token = localStorage.getItem('token'); // Récupérer le token
  
      if (editingCategory) {
        response = await apiService.put(`/admin/categories/${editingCategory.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await apiService.post('/admin/categories', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      //setCategories(prev => [...prev, response.data]);
      setCategories(prev => 
        editingCategory 
          ? prev.map(cat => cat.id === editingCategory.id ? response.data : cat) // 🔄 Mise à jour
          : [...prev, response.data] // ➕ Ajout d'une nouvelle catégorie
      );
      
      toast.success('Catégorie ajoutée avec succès!');
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde de la catégorie');
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.delete(`/admin/categories/${categoryToDelete.id}`);
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      toast.success('Catégorie supprimée avec succès!');
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de la catégorie');
    }
  };

  const CategoryForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || { nomCategorie: '' });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de la catégorie
          </label>
          <input
            type="text"
            value={formData.nomCategorie}
            onChange={(e) => setFormData({ ...formData, nomCategorie: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            {initialData ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    );
  };

  // Rest of the component remains the same...
  return (
    <div className="p-8">
      <ToastContainer />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
         + Ajouter une catégorie
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCategories?.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.nomCategorie}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setIsFormOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-600 rounded-md mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(category);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-600 rounded-md"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-md ${
              currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">
              {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            </h2>
            <CategoryForm
              onSubmit={handleCategorySubmit}
              initialData={editingCategory}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Confirmer la suppression</h2>
            <p className="text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete?.nomCategorie}" ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;