/*import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const AdminProfile = () => {
    const { user } = useContext(AuthContext);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user && user.userId) {
            fetchAdminProfile(user.userId);
        }
    }, [user]);

    const fetchAdminProfile = async (userId) => {
        try {
            const response = await apiService.get(`/admin/users/${userId}`);
            setAdmin(response.data);
            setFormData({ nom: response.data.nom, prenom: response.data.prenom, password: '', confirmPassword: '' });
        } catch (err) {
            setError("Erreur lors du chargement du profil.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await apiService.put(`/admin/users/${user.userId}`, {
                nom: formData.nom,
                prenom: formData.prenom,
                password: formData.password || undefined
            });

            setAdmin({ ...admin, nom: formData.nom, prenom: formData.prenom });
            setEditMode(false);
            setError(null);
        } catch (err) {
            setError("Erreur lors de la mise à jour.");
        }
    };

    if (loading) return <p>Chargement du profil...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-center mb-4">Profil Administrateur</h2>

            {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nom</label>
                        <input 
                            type="text" 
                            name="nom" 
                            value={formData.nom} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Prénom</label>
                        <input 
                            type="text" 
                            name="prenom" 
                            value={formData.prenom} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nouveau mot de passe (optionnel)</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Confirmer le mot de passe</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Annuler</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Enregistrer</button>
                    </div>
                </form>
            ) : (
                <div>
                    <p><strong>Nom :</strong> {admin.nom}</p>
                    <p><strong>Prénom :</strong> {admin.prenom}</p>
                    <p><strong>Email :</strong> {admin.email}</p>
                    <p><strong>Rôle :</strong> {admin.role?.nomRole}</p>

                    <button onClick={() => setEditMode(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Modifier</button>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;
*/ import React, { useEffect, useState, useContext } from 'react';
 import { AuthContext } from '../../contexts/AuthContext';
 import apiService from '../../services/apiService';

    const AdminProfile = () => {
       const { user } = useContext(AuthContext);
        const [admin, setAdmin] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
       const [editMode, setEditMode] = useState(false);
        const [formData, setFormData] = useState({
            nom: '',
            prenom: '',
           password: '',
          confirmPassword: ''
      });

        useEffect(() => {
            document.title = "Dashboard - Profile";
          const fetchAdminProfile = async (userId) => {
                try {
                    const response = await apiService.get(`/admin/users/${userId}`);
                    setAdmin(response.data);
                 setFormData({
                        nom: response.data.nom,
                        prenom: response.data.prenom,
                        password: '',
                        confirmPassword: ''
                    });
                } catch (err) {
                    setError("Erreur lors du chargement du profil.");
               } finally {
                    setLoading(false);
                }
            };
             fetchAdminProfile(user.userId);
       }, [user]);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
           e.preventDefault();
            if (formData.password && formData.password !== formData.confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
              return;
          }

          try {
              console.log("Appel API avec : " + user.userId);
              console.log("Appel API avec formdata : ",formData);
              await apiService.put(`/admin/users/${user.userId}`, {  //log
                    nom: formData.nom,
                    prenom: formData.prenom,
                     password: formData.password ? formData.password : undefined
               });
              console.log("api call pass"); //log

                setAdmin({ ...admin, nom: formData.nom, prenom: formData.prenom });
              setEditMode(false);
                setError(null);
            } catch (err) {
                 console.error(err); //log
                setError("Erreur lors de la mise à jour : " + err.message || "Erreur inconnue.");
            }
        };

       if (loading) return <p>Chargement du profil...</p>;
       if (error) return <p className="text-red-500">{error}</p>;

        return (
            <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold text-center mb-4">Profil Administrateur</h2>

                {editMode ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Nouveau mot de passe (optionnel)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="flex justify-between">
                            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Annuler</button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Enregistrer</button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <p><strong>Nom :</strong> {admin.nom}</p>
                        <p><strong>Prénom :</strong> {admin.prenom}</p>
                        <p><strong>Email :</strong> {admin.email}</p>
                        <p><strong>Rôle :</strong> {admin.role?.nomRole}</p>

                        <button onClick={() => setEditMode(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Modifier</button>
                    </div>
                )}
            </div>
        );
    };

    export default AdminProfile;