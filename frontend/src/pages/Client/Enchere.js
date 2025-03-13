import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
   import useFetch from "../../hooks/useFetch";
   import apiService from '../../services/apiService';

   function Enchere() {
       const { id } = useParams();
       const { data, loading, error } = useFetch(`/client/encheres/${id}`);
       const [timeLeft, setTimeLeft] = useState(0);
       const [montant, setMontant] = useState("");
       const [montantError, setMontantError] = useState(null);
     const [participationLoading, setParticipationLoading] = useState(false);
       const [participationError, setParticipationError] = useState(null);

      const enchere = data?.enchere;
       const userId = localStorage.getItem('userId');
       const token = localStorage.getItem('token');
       const participations = data?.participations || [];

       const [minPrice, setMinPrice] = useState(0);
     const [winnerId, setWinnerId] = useState(null);
     const [winningPrice, setWinningPrice] = useState(0);
       const isOwner = enchere?.product?.user?.id === parseInt(userId);

       useEffect(() => {
           if (enchere) {
               // Déterminer le prix minimum de l'enchère (prix de départ ou plus haute participation)
               if (participations.length > 0) {
                 const maxParticipation = participations.reduce(
                       (max, p) => (p.prixPropose > max.prixPropose ? p : max),
                       participations[0]
                   );
                   setMinPrice(maxParticipation.prixPropose);
                } else {
                   setMinPrice(enchere.prixDepart);
               }

               // Vérifier si l'enchère est terminée et définir le gagnant
               if (new Date(enchere.dateFin) < new Date() && participations.length > 0) {
                   const highestBid = participations.reduce(
                       (max, p) => (p.prixPropose > max.prixPropose ? p : max),
                       participations[0]
                   );
                   setWinnerId(highestBid?.user?.id || null);
                   setWinningPrice(highestBid?.prixPropose || 0); // 🔥 Stocke le prix gagnant
               }
           }
       }, [enchere, participations]);

       useEffect(() => {
           if (enchere?.dateFin) {
              const endDate = new Date(enchere.dateFin).getTime();
               const now = new Date().getTime();
               const initialTimeLeft = endDate - now;

                setTimeLeft(initialTimeLeft > 0 ? initialTimeLeft : 0);

               const interval = setInterval(() => {
                   const now = new Date().getTime();
                   const remainingTime = endDate - now;
                    setTimeLeft(remainingTime > 0 ? remainingTime : 0);
               }, 1000);

               return () => clearInterval(interval);
           }
       }, [enchere?.dateFin]);

       const handleSubmit = async (e) => {
           e.preventDefault();
         setMontantError(null);

          if (!montant || parseFloat(montant) <= minPrice) {
               setMontantError(`Le montant doit être supérieur à ${minPrice} DH.`);
              return;
           }

           setParticipationLoading(true);
           setParticipationError(null);

           try {
               const bidData = {
                   enchere: { id: enchere.id },
                    user: { id: userId },
                   prixPropose: parseFloat(montant),
               };

               const response = await apiService.post('/client/participations', bidData, {
                   headers: {
                       'Authorization': `Bearer ${token}`,
                   },
               });

               if (response.status !== 200 && response.status !== 201) {
                  throw new Error(response.data?.message || 'Échec de l’envoi de l’offre.');
              }

               console.log('Offre soumise avec succès !');
               alert('Offre soumise avec succès !');
               setMontant('');
           } catch (err) {
               setParticipationError(err.message);
              console.error("Erreur lors de l'envoi de l’offre :", err);
           } finally {
               setParticipationLoading(false);
           }
       };

      if (loading) {
           return <div>Chargement des informations de l'enchère...</div>;
      }

      if (error) {
           return <div>Erreur : {error.message}</div>;
       }

     if (!enchere) {
         return <div>Aucune enchère trouvée.</div>;
       }

       const formatTime = (time) => {
           const days = Math.floor(time / (1000 * 60 * 60 * 24));
           const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
           const seconds = Math.floor((time % (1000 * 60)) / 1000);
           return `${days}j ${hours}h ${minutes}m ${seconds}s`;
      };

       return (
           <div className="enchere-container p-6 max-w-4xl mx-auto">
               <h1 className="text-3xl font-bold text-center mb-6">{enchere.product.nomProduit}</h1>
               <div className="enchere-content grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <img
                     src={enchere.product.images || "https://via.placeholder.com/600x400"}
                       alt={enchere.product.nomProduit}
                       className="rounded-lg shadow-lg"
                   />
                   <div className="details p-4 bg-white shadow-md rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Détails du produit</h2>
                       <p className="text-lg text-gray-700 mb-2">
                            <strong>Prix de départ :</strong> {enchere.prixDepart} DH
                       </p>
                       <p className="text-lg text-gray-700 mb-2">
                          <strong>Prix Actuel :</strong> {minPrice} DH
                       </p>
                       <p className="text-lg text-gray-700 mb-2">
                         <strong>Description :</strong> {enchere.product.description || "Non spécifiée"}
                       </p>
                       <p className="text-lg text-gray-700 mb-4">
                          <strong>Temps restant :</strong>{" "}
                           <span className="text-red-500 font-bold">
                             {timeLeft > 0 ? formatTime(timeLeft) : "Enchère terminée"}
                           </span>
                       </p>

                       {/* Message si l'enchère est terminée */}
                       {timeLeft <= 0 && (
                           <div className={`mt-4 p-3 rounded-md text-white font-bold text-center ${winnerId === parseInt(userId) ? 'bg-green-600' : 'bg-red-600'}`}>
                               {winnerId === parseInt(userId) ? (
                                   <>
                                       🎉 Félicitations ! Vous avez remporté cette enchère avec <span className="text-yellow-300">{winningPrice} DH</span>.
                                   </>
                               ) : (
                                   <>
                                       ⏳ L'enchère est terminée. Le gagnant a proposé <span className="text-yellow-300">{winningPrice} DH</span>.
                                   </>
                               )}
                           </div>
                       )}

                       {timeLeft > 0 && !isOwner && (
                           <form onSubmit={handleSubmit} className="participation-form">
                               <label className="block text-gray-700 font-bold mb-2" htmlFor="montant">
                                   Entrez votre montant :
                               </label>
                               <input
                                   type="number"
                                   id="montant"
                                   value={montant}
                                   onChange={(e) => setMontant(e.target.value)}
                                   className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                   placeholder="Montant proposé"
                                   min={minPrice}
                                   required
                               />
                               <button
                                   type="submit"
                                   className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition duration-300"
                                   disabled={participationLoading}
                               >
                                   {participationLoading ? 'Envoi...' : 'Participer'}
                               </button>
                               {montantError && <p className="text-red-500 mt-2">{montantError}</p>}
                           </form>
                       )}

                      {isOwner && <p className="text-gray-700 font-bold mt-4">Vous êtes le propriétaire de cette enchère et ne pouvez pas y participer.</p>}
                   </div>
               </div>
           </div>
       );
   }

   export default Enchere;