import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";

function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [showFinished, setShowFinished] = useState(false);
    const encheresPerPage = 12;
useEffect(() => {
    document.title = 'Accueil '; // Titre de la page
  }, []);
    const { data: encheres, loading, error } = useFetch("/client/encheres");
    const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetch("/client/categories");
    const baseUrl = "http://localhost:8082";

    if (loading || categoriesLoading) {
        return <div className="flex items-center justify-center h-64"><div className="loader"></div></div>;
    }

    if (error || categoriesError) {
        return <div className="text-center text-red-500 p-6">Erreur de chargement des données</div>;
    }

    const isAuctionFinished = (dateFin) => new Date(dateFin) <= new Date();

    const filteredEncheres = encheres
        .filter(enchere => !selectedCategory || enchere.product?.categorie?.id === Number(selectedCategory))
        .filter(enchere => !searchTerm || enchere.product.nomProduit.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(enchere => (!minPrice || enchere.prixDepart >= Number(minPrice)) && (!maxPrice || enchere.prixDepart <= Number(maxPrice)))
        //.filter(enchere => showFinished ? isAuctionFinished(enchere.dateFin) : !isAuctionFinished(enchere.dateFin));
       .filter(enchere => true) // Afficher toutes les enchères, terminées et en cours

    const sortedEncheres = [...filteredEncheres].sort((a, b) => new Date(a.dateFin) - new Date(b.dateFin));

    const indexOfLastEnchere = currentPage * encheresPerPage;
    const indexOfFirstEnchere = indexOfLastEnchere - encheresPerPage;
    const currentEncheres = sortedEncheres.slice(indexOfFirstEnchere, indexOfLastEnchere);
    const totalPages = Math.ceil(sortedEncheres.length / encheresPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const formatDate = (dateString) => new Date(dateString).toLocaleString("fr-FR");

    return (
        
        <motion.div className="p-6 bg-gray-100 rounded-md shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <section className="text-center mb-8">
                <motion.h2 className="text-5xl font-bold text-blue-600 mb-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>Plateforme d'Enchères Professionnelles</motion.h2>
                <p className="text-lg text-gray-700">Découvrez et participez aux enchères en ligne pour acquérir des produits exclusifs au meilleur prix.</p>
            </section>

            <div className="flex flex-wrap gap-4 mb-6 justify-center">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-white border border-gray-300 rounded-lg py-2 px-4">
                    <option value="">Toutes les catégories</option>
                    {categories.map((categorie) => (
                        <option key={categorie.id} value={categorie.id}>{categorie.nomCategorie}</option>
                    ))}
                </select>
                <input type="text" placeholder="Rechercher un produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-4" />
                <input type="number" placeholder="Prix min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-4 w-28" />
                <input type="number" placeholder="Prix max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-4 w-28" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {currentEncheres.map((enchere) => (
                    <motion.div key={enchere.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
                        <img src={enchere.product.images.startsWith("http") ? enchere.product.images : `${baseUrl}/images/${enchere.product.images}`} alt={enchere.product.nomProduit} className="w-full h-48 object-cover transform transition-all duration-500 hover:scale-105" />
                        <div className="p-4">
                            <h3 className="font-bold text-xl text-gray-800 mb-2">{enchere.product.nomProduit}</h3>
                            <p className="text-lg text-gray-700">Prix de départ : <span className="font-semibold">{enchere.prixDepart} DH</span></p>
                            <p className="text-sm text-gray-500">Fin : {formatDate(enchere.dateFin)}</p>
                            <div className="mt-3">
                            <Link
    to={`/enchere/${enchere.id}`}
    className="text-blue-600 underline hover:text-blue-800 transition duration-200"
>
    Voir l'enchère
</Link>

                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center mt-6">
                {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => handlePageChange(i + 1)} className={`mx-1 px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>{i + 1}</button>
                ))}
            </div>
        </motion.div>
    );
}

export default Home;








/*  import React, { useState } from "react";
   import { Link } from "react-router-dom";
   import useFetch from "../../hooks/useFetch";

    function Home() {
       const [currentPage, setCurrentPage] = useState(1);
       const encheresPerPage = 6; // Set the number of encheres to display per page

       const { data: encheres, loading, error } = useFetch("/client/encheres");
       const baseUrl = 'http://localhost:8082';


       if (loading) {
           return (
              <div className="flex items-center justify-center h-64">
                   <div className="loader"></div>
                </div>
           );
       }

       if (error) {
          return <div className="text-center text-red-500 p-6">Erreur : {error.message}</div>;
        }

        const isAuctionFinished = (dateFin) => {
            return new Date(dateFin) <= new Date();
         };

        // Calculate the index of the first and last encheres on the current page
         const indexOfLastEnchere = currentPage * encheresPerPage;
         const indexOfFirstEnchere = indexOfLastEnchere - encheresPerPage;
        // Get the encheres for the current page
        const currentEncheres = encheres && encheres.slice(indexOfFirstEnchere, indexOfLastEnchere);

        // Calculate the total number of pages
        const totalPages = encheres ? Math.ceil(encheres.length / encheresPerPage) : 0;

       const handlePageChange = (pageNumber) => {
          setCurrentPage(pageNumber);
       };
     const formatDate = (dateString) => {
           const date = new Date(dateString);
           const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
           return date.toLocaleDateString('fr-FR', options) + " UTC"; // Formater la date comme voulu
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

     return (
            <div className="landing-container p-6 bg-white rounded-md shadow-lg">
                <section className="auctions-section">
                  <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                      Enchères en cours
                   </h2>
                     <p className="text-gray-600 text-center mb-8">
                       Explorez nos dernières enchères disponibles.
                    </p>


                     {currentEncheres && currentEncheres.length === 0 && (
                         <div className="text-center text-red-500">
                           Aucune enchère en cours
                        </div>
                     )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentEncheres &&
                            currentEncheres.map((enchere) => (
                             <div
                                 className="auction-card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                 key={enchere.id}
                            >
                                <img
                                     src={ enchere.product.images.startsWith('http') ? enchere.product.images : `${baseUrl}/images/${enchere.product.images}` }
                                    alt={enchere.product.nomProduit}
                                    className="w-full h-48 object-cover"
                                  />

                               <div className="auction-info p-4">
                                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                                     {enchere.product.nomProduit}
                                    </h3>
                                   <p className="text-lg text-gray-700 mb-1">
                                        Prix de départ :{" "}
                                       <span className="font-semibold">
                                          {enchere.prixDepart} DH
                                         </span>
                                   </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                     Fin de l'enchère :{" "}
                                        {formatDate(enchere.dateFin)}
                                   </p>
                                   <div className="flex justify-between items-center">
                                       {isAuctionFinished(enchere.dateFin) ? (
                                          <span className="text-red-500  font-semibold">
                                              Vente terminée
                                          </span>
                                       ) : (
                                         <Link
                                                to={`/enchere/${enchere.id}`}
                                                className="bg-navy-500 text-green px-5 py-3 rounded-lg hover:bg-navy-700 hover:underline"
                                           >
                                              Voir l'enchère
                                           </Link>
                                       )}
                                 </div>
                             </div>
                         </div>
                      ))}
                  </div>
                    <div className="flex justify-center mt-6">
                        {renderPageNumbers()}
                   </div>
               </section>
            </div>
        );
    }
   export default Home;*/