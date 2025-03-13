import React, { useState ,useEffect} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetch from '../../hooks/useFetch';
import apiService from '../../services/apiService';

const Roles = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;

  const { data: roles, loading, error, setData: setRoles } = useFetch('/admin/roles');
useEffect(() => {
    document.title = 'Dashboard - Rôles'; // Titre de la page
  }, []);
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles?.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = roles ? Math.ceil(roles.length / rolesPerPage) : 0;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRoleSubmit = async (formData) => {
    try {
      let response;
      const token = localStorage.getItem('token');

      if (editingRole) {
        response = await apiService.put(`/admin/roles/${editingRole.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await apiService.post('/admin/roles', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setRoles(prev =>
        editingRole
          ? prev.map(role => (role.id === editingRole.id ? response.data : role))
          : [...prev, response.data]
      );

      toast.success('Rôle sauvegardé avec succès!');
      setIsFormOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde du rôle');
    }
  };

  const handleDelete = async () => {
    try {
      console.log('Suppression du rôle:', roleToDelete); // Vérifier l'objet roleToDelete
      await apiService.delete(`/admin/roles/${roleToDelete.id}`);
      setRoles(prev => prev.filter(role => role.id !== roleToDelete.id));
      toast.success('Rôle supprimé avec succès!');
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression du rôle');
    }
  };

  const handleDeleteDialog = (role) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const RoleForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || { nomRole: '' });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom du rôle</label>
          <input
            type="text"
            value={formData.nomRole}
            onChange={(e) => setFormData({ ...formData, nomRole: e.target.value })}
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

  const DeleteDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium mb-4">Êtes-vous sûr de vouloir supprimer ce rôle ?</h2>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsDeleteDialogOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Rôles</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          + Ajouter un rôle
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
            {currentRoles?.map((role) => (
              <tr key={role.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {role.nomRole}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setIsFormOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-600 rounded-md mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteDialog(role)}
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

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">{editingRole ? 'Modifier le rôle' : 'Ajouter un rôle'}</h2>
            <RoleForm onSubmit={handleRoleSubmit} initialData={editingRole} />
          </div>
        </div>
      )}

      {isDeleteDialogOpen && <DeleteDialog />}
    </div>
  );
};

export default Roles;
