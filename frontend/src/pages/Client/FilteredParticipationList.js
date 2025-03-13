import React, { useState, useEffect, useCallback } from 'react';
import useFetch from "../../hooks/useFetch";
import { useParams } from 'react-router-dom';

function FilteredParticipationList() {
    const { categoryId } = useParams();
    const userId = localStorage.getItem('userId');
    const [participationsWithMax, setParticipationsWithMax] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = categoryId
        ? `/client/user/${userId}/category/${categoryId}`
        : `/client/user/${userId}`;
    const { data: participations, loading: fetchLoading, error: fetchError } = useFetch(url);


     const fetchParticipations = useCallback(() => {
        setLoading(true);
        setError(null);
          if (participations) {
              // Group participations by enchere id
                const grouped = participations.reduce((acc, participation) => {
                  const enchereId = participation.enchere.id;
                  if (!acc[enchereId]) {
                      acc[enchereId] = [];
                  }
                  acc[enchereId].push(participation);
                  return acc;
                }, {});


                const enhancedParticipations = Object.values(grouped).map((enchereParticipations) => {
                  // Sort by price
                  const sortedParticipations = [...enchereParticipations].sort((a,b) => b.prixPropose - a.prixPropose);
                  return {
                      ...sortedParticipations[0], // Use first element as reference
                      participations: sortedParticipations,
                  };
                });
             setParticipationsWithMax(enhancedParticipations);
        } else {
            setParticipationsWithMax([]);
        }
    }, [participations]);

    useEffect(() => {
            document.title = 'Mes participations par categorie '; // Titre de la page
         
      fetchParticipations();
      if (fetchError) {
          setError(fetchError)
      }
      setLoading(fetchLoading);
    }, [fetchParticipations, fetchError, fetchLoading]);


    const handleCategoryClick = (enchereId) => {
        setExpandedCategory(expandedCategory === enchereId ? null : enchereId);
    };

    if (loading) {
        return <div>Chargement de vos participations...</div>;
    }

    if (error) {
        return <div>Erreur : {error.message}</div>;
    }

    if (!participationsWithMax || participationsWithMax.length === 0) {
        return (
            <div className="participations-container p-6 max-w-6xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-center mb-6">Mes Participations</h1>
                <p>Vous n'avez participé à aucune enchère pour cette catégorie.</p>
            </div>
        );
    }

    return (
        <div className="participations-container p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Mes Participations</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {participationsWithMax.map((participation) => (
                    <div
                        key={participation.enchere.id}
                        className="participation-card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="p-4">
                            <h2
                                className="font-bold text-xl text-gray-800 mb-2 cursor-pointer"
                                onClick={() => handleCategoryClick(participation.enchere.id)}
                            >
                                {participation.enchere.product.nomProduit}
                            </h2>
                            <p className="text-gray-700 mb-1">
                                Catégorie :{" "}
                                <span className="font-semibold">
                                    {participation.enchere.product.categorie.nomCategorie}
                                </span>
                            </p>
                            <p className="text-gray-700 mb-1">
                                Date participation :{" "}
                                <span className="font-semibold">
                                    {new Date(participation.dateParticipation).toLocaleDateString()}
                                </span>
                            </p>
                            <p className="text-gray-700 mb-2">
                                Montant maximum proposé :
                                <span className="font-semibold text-green-600">
                                    {" "}
                                    {participation.prixPropose} DH
                                </span>
                            </p>
                            {expandedCategory === participation.enchere.id && (
                                <>
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                                        Vos participations
                                    </h3>
                                    {participation.participations.map((p) => (
                                        <p key={p.id} className="text-gray-700 mb-1">
                                            {new Date(p.dateParticipation).toLocaleDateString()}:
                                            <span className="font-semibold"> {p.prixPropose} DH</span>
                                        </p>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilteredParticipationList;