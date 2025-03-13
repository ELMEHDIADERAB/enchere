import React, { useState, useContext, useEffect } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import enchereImage from '../assets/images/enchere.jpeg'; // Import de l'image
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

function Login() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext);
useEffect(() => {
    document.title = 'Enchère '; // Titre de la page
  }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const loggedUser = await login(email, motDePasse); // Récupère l'utilisateur connecté
            if (loggedUser.role.includes('ADMIN')) {
                toast.success('Connexion réussie, redirection vers le tableau de bord admin.'); // Affichage du message de succès
                navigate('/admin/dashboard');
            } else {
                toast.success("Connexion réussie. Bienvenue sur votre espace personnel."); // Affichage du message de succès
                navigate('/');
            }
        } catch (err) {
            setError(err.message || "Erreur d'authentification");
            console.error(err);
            toast.error("Nom d'utilisateur ou mot de passe incorrect."); // Affichage du message d'erreur
        }
    };

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
                        Participez aux enchères et achetez des produits exclusifs. Connectez-vous pour accéder à votre espace personnel et découvrir les dernières offres en ligne.
                    </p>
                </motion.div>

                {/* Formulaire de Connexion */}
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Connectez-vous</h2>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
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
                            name="email"
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
                            name="motDePasse"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-500 focus:outline-none shadow-md transform transition-all duration-300 hover:scale-105"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                        >
                            Se connecter
                        </Button>
                    </motion.div>
                </form>
                <motion.p
                    className="mt-4 text-sm text-center text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                >
                    Pas encore inscrit ?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Créer un compte
                    </a>
                </motion.p>
            </div>
        </motion.div>
    );
}

export default Login;







/*port React, { useState, useContext } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import enchereImage from '../assets/images/enchere.jpeg'; // Import de l'image
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const loggedUser = await login(email, motDePasse); // Récupère l'utilisateur connecté
            if (loggedUser.role.includes('ADMIN')) {
                toast.success('Connexion réussie, redirection vers le tableau de bord admin.'); // Affichage du message de succès
                navigate('/admin/dashboard');
            } else {
                toast.success("Connexion réussie. Bienvenue sur votre espace personnel."); // Affichage du message de succès

                navigate('/');
            }
        } catch (err) {
            setError(err.message || "Erreur d'authentification");
            console.error(err);
            toast.error("Nom d'utilisateur ou mot de passe incorrect."); // Affichage du message d'erreur

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
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Connectez-vous
                </h2>
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
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Se connecter
                    </Button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Pas encore inscrit ? <a href="/register" className="text-blue-600 hover:underline">Créer un compte</a>
                </p>
            </div>
        </div>
    );
}

export default Login;*/

///////////////////////////////


/*import React, { useState, useContext } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
   const [error, setError] = useState(null);
   const navigate = useNavigate();
   const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
      setError(null);
      try{
         await login(email,motDePasse);
        navigate('/admin/dashboard');
      }catch(err){
         setError(err.message || "Erreur d'authentification") ;
        console.error(err);
    }
};
    return (
        <div className="container mx-auto p-4 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Connexion</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    name="email"
               />
                <Input
                    type="password"
                  placeholder="Mot de passe"
                   value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                   required
                   name="motDePasse"
              />
             <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700">
                  Se connecter
               </Button>
            </form>
        </div>
   );
}
export default Login;*/