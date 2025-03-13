import React, { useState, useEffect } from 'react'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetch from '../../hooks/useFetch';
import apiService from '../../services/apiService';

const Users = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const usersPerPage = 10;

  const { data: users, loading, error, setData: setUsers } = useFetch('/admin/users');

  useEffect(() => {
    document.title = "Dashboard - Utilisateurs";
    const fetchRoles = async () => {
      try {
        const response = await apiService.get('/admin/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error);
        toast.error('Erreur lors de la récupération des rôles');
      }
    };
    fetchRoles();
  }, []);

  const filteredUsers = users?.filter(user => 
    user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );  

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = filteredUsers ? Math.ceil(filteredUsers.length / usersPerPage) : 0;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUserSubmit = async (formData) => {
    try {
      let response;
      const token = localStorage.getItem('token');
  
      const userPayload = {
        ...formData,
        role: { id: formData.role } // S'assurer que le rôle est un objet avec un ID
      };
  
      if (editingUser) {
        response = await apiService.put(`/admin/users/${editingUser.id}`, userPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await apiService.post('/admin/users', userPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      setUsers(prev =>
        editingUser
          ? prev.map(user => (user.id === editingUser.id ? response.data : user))
          : [...prev, response.data]
      );
  
      toast.success('Utilisateur sauvegardé avec succès!');
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'utilisateur');
    }
  };
  

  const handleDelete = async () => {
    try {
      await apiService.delete(`/admin/users/${userToDelete.id}`);
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      toast.success('Utilisateur supprimé avec succès!');
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleDeleteDialog = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const UserForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
      nomUtilisateur: '',
      email: '',
      motDePasse: '',
      nom: '',
      prenom: '',
      adresse: '',
      tel: '',
      role: '',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            value={formData.nomUtilisateur}
            onChange={(e) => setFormData({ ...formData, nomUtilisateur: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de Passe</label>
          <input
            type="password"
            value={formData.motDePasse}
            onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Adresse</label>
          <input
            type="text"
            value={formData.adresse}
            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <input
            type="text"
            value={formData.tel}
            onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rôle</label>
          <select
  value={formData.role} 
  onChange={(e) => setFormData({ ...formData, role: parseInt(e.target.value) })} 
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
>
  <option value="">Sélectionner un rôle</option>
  {roles?.map((role) => (
    <option key={role.id} value={role.id}>
      {role.nomRole}
    </option>
  ))}
</select>

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
        <h2 className="text-lg font-medium mb-4">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</h2>
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
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          + Ajouter un utilisateur
        </button>
      </div>

      {/* Champ de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.prenom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.adresse}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.tel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setIsFormOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-600 rounded-md mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteDialog(user)}
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

      <div className="flex justify-between mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Précédent
        </button>
        <span className="text-sm font-medium text-gray-700">Page {currentPage} de {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Suivant
        </button>
      </div>

      {isFormOpen && <UserForm onSubmit={handleUserSubmit} initialData={editingUser} />}
      {isDeleteDialogOpen && <DeleteDialog />}
    </div>
  );
};

export default Users;