import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";
const Profile = () => {
    const { user, token } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        nom: '',
        prenom: '',
        adresse: '',
        tel: '',
        motDePasse: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);  // Error state for better error handling

    useEffect(() => {
        if (user && user.email) {
            setLoading(true);  // Set loading state to true when fetching data
            const fetchUserData = async () => {
                try {
                    const response = await apiService.get(`/client/users/${user.userId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.status === 200) {
                        const { nom, prenom, adresse, tel } = response.data;
                        setProfile({ nom, prenom, adresse, tel, motDePasse: "" });
                    } else {
                        setError("Impossible de récupérer les données du profil.");
                        toast.error("Impossible de récupérer les données du profil.");
                    }
                } catch (error) {
                    setError("Erreur lors de la récupération des données.");
                    toast.error("Erreur lors de la récupération des données.");
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);  // Set loading to false after data fetching is complete
                }
            };
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [user, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedProfile = {
                nom: profile.nom,
                prenom: profile.prenom,
                adresse: profile.adresse,
                tel: profile.tel,
                motDePasse: profile.motDePasse || undefined,
            };

            const response = await apiService.put("/admin/users/me", updatedProfile, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.status === 200) {
                toast.success("Profile updated successfully");
                setIsModalOpen(false);
                setEditMode(false);  // Disable edit mode on success
            } else {
                toast.error("An error occurred while updating your profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating your profile.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (!user) {
        return <div className="text-center p-6">Please login to access your profile</div>;
    }

    return (
        <motion.div 
            className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
        >
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Mon Profil</h2>

            {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">Nom:</label>
                        <Input
                            type="text"
                            id="nom"
                            name="nom"
                            value={profile.nom || ""}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prenom">Prénom:</label>
                        <Input
                            type="text"
                            id="prenom"
                            name="prenom"
                            value={profile.prenom || ""}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adresse">Adresse:</label>
                        <Input
                            type="text"
                            id="adresse"
                            name="adresse"
                            value={profile.adresse || ""}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tel">Téléphone:</label>
                        <Input
                            type="text"
                            id="tel"
                            name="tel"
                            value={profile.tel || ""}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motDePasse">Nouveau mot de passe (optionnel):</label>
                        <Input
                            type="password"
                            id="motDePasse"
                            name="motDePasse"
                            value={profile.motDePasse || ""}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Annuler
                        </button>
                        <Button
                            type="submit"
                            className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="text-gray-700">
                    <p className="mb-2"><strong>Nom :</strong> {profile.nom || "Non renseigné"}</p>
                    <p className="mb-2"><strong>Prénom :</strong> {profile.prenom || "Non renseigné"}</p>
                    <p className="mb-2"><strong>Email :</strong> {user.email || "Non renseigné"}</p>
                    <p className="mb-2"><strong>Téléphone :</strong> {profile.tel || "Non renseigné"}</p>
                    <p className="mb-2"><strong>Adresse :</strong> {profile.adresse || "Non renseigné"}</p>
                    <Button onClick={() => setEditMode(true)} className="bg-blue-500 text-white hover:bg-blue-700 mt-4">Modifier Profil</Button>
                </div>
            )}
        </motion.div>
    );
};

export default Profile;
