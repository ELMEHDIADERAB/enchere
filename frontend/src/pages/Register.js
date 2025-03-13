/*import React, { useState, useContext } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import enchereImage from '../assets/images/enchere.jpeg'; // Import de l'image

function Register() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [confirmerMotDePasse, setConfirmerMotDePasse] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (motDePasse !== confirmerMotDePasse) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        try {
            await register(email, motDePasse);
            navigate('/login'); // Rediriger vers la page de connexion après l'inscription réussie
        } catch (err) {
            setError(err.message || "Erreur d'inscription");
            console.error(err);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundImage: `linear-gradient(
                    to right, 
                    rgba(19, 123, 123, 0.7), 
                    rgba(56, 178, 172, 0.8), 
                    rgba(204, 251, 241, 0.9)
                )`,
                backgroundSize: 'cover',
            }}
        >
            <div className="w-full max-w-md bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
                <div className="flex justify-center mb-6">
                    <img
                        src={enchereImage}
                        alt="Enchère"
                        className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-teal-500 shadow-xl"
                    />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Inscription</h2>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            type="email"
                            placeholder="Saisissez votre adresse e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            name="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder="Saisissez votre mot de passe"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            required
                            name="motDePasse"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder="Confirmez votre mot de passe"
                            value={confirmerMotDePasse}
                            onChange={(e) => setConfirmerMotDePasse(e.target.value)}
                            required
                            name="confirmerMotDePasse"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        S'inscrire
                    </Button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Déjà inscrit ? <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
                </p>
            </div>
        </div>
    );
}

export default Register;
*/
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import enchereImage from '../assets/images/enchere.jpeg'; // Import de l'image
import { motion } from 'framer-motion';

function Register() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Réinitialiser les erreurs

        try {
            await register(email, motDePasse, nom, prenom);
            toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter."); // Affichage du message de succès
            navigate('/login');
            return;
        } catch (err) {
            setError(err.message || "Erreur lors de l'inscription"); // Afficher l'erreur
            toast.error(err.message || "Erreur lors de l'inscription"); // Afficher un message d'erreur
        }
    };
useEffect(() => {
    document.title = 'Enchères '; // Titre de la page
  }, []);
    return (
        <motion.div
            className="flex items-center justify-center min-h-screen bg-cover"
            style={{
                backgroundImage: `url(${enchereImage})`, // Image de fond
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="w-full max-w-md bg-white bg-opacity-50 rounded-lg shadow-lg p-6 backdrop-blur-lg">
                {/* Section Titre et Description - Extérieure au formulaire */}
                <motion.div
                    className="mb-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Bienvenue sur l'Application des Enchères</h1>
                    <p className="text-lg text-gray-600">
                        Créez un compte pour participer aux enchères et découvrir des produits exclusifs. Rejoignez-nous et soyez prêts à enchérir !
                    </p>
                </motion.div>

                {/* Formulaire d'Inscription */}
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Créez un compte</h2>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>} {/* Afficher l'erreur si présente */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Input
                            type="email"
                            placeholder="Saisissez votre adresse e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-500 focus:outline-none shadow-md transform transition-all duration-300 hover:scale-105"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Input
                            type="password"
                            placeholder="Saisissez votre mot de passe"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-500 focus:outline-none shadow-md transform transition-all duration-300 hover:scale-105"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Input
                            type="text"
                            placeholder="Saisissez votre nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-500 focus:outline-none shadow-md transform transition-all duration-300 hover:scale-105"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        <Input
                            type="text"
                            placeholder="Saisissez votre prénom"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-500 focus:outline-none shadow-md transform transition-all duration-300 hover:scale-105"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                        >
                            S'inscrire
                        </Button>
                    </motion.div>
                </form>
                <motion.p
                                    className="mt-4 text-sm text-center text-gray-600"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                >
                                    Déjà un compte ?{' '}
                                    <a href="/login" className="text-blue-600 hover:underline">
                                    Connectez-vous ici
                                    </a>
                                </motion.p>
            </div>
        </motion.div>
    );
}

export default Register;
