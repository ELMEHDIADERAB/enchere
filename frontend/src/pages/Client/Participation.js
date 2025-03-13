import React, { useState, useEffect } from 'react';
import useFetch from "../../hooks/useFetch";
import { useParams } from 'react-router-dom';

function Participation() {
    const { categoryId } = useParams();
    const userId = localStorage.getItem('userId'); // Récupération de l'utilisateur connecté

    const url = categoryId
        ? `/client/participations/user/${userId}/category/${categoryId}`
        : `/client/participations/user/${userId}`;

    const { data: participations, loading, error } = useFetch(url);
    const [participationsWithMax, setParticipationsWithMax] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);

    useEffect(() => {
        document.title = 'Mes Participations'; // Titre de la page

        if (participations) {
            // Regrouper les participations par enchère
            const grouped = participations.reduce((acc, participation) => {
                const enchereId = participation.enchere.id;
                if (!acc[enchereId]) {
                    acc[enchereId] = [];
                }
                acc[enchereId].push(participation);
                return acc;
            }, {});

            // Trier et récupérer la participation avec le prix max
            const enhancedParticipations = Object.values(grouped).map((enchereParticipations) => {
                const sortedParticipations = [...enchereParticipations].sort((a, b) => b.prixPropose - a.prixPropose);
                return {
                    ...sortedParticipations[0], // Gagnant de l'enchère
                    participations: sortedParticipations,
                };
            });

            setParticipationsWithMax(enhancedParticipations);
        }
    }, [participations]);

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
        return <div className="text-center mt-6">Vous n'avez participé à aucune enchère.</div>;
    }

    return (
        <div className="participations-container p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Mes Participations</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {participationsWithMax.map((participation) => {
                    const enchereTerminee = new Date(participation.enchere.dateFin) < new Date();
                    const gagnantId = participation.user.id; // L'utilisateur qui a proposé le prix max
                    const isCurrentUserWinner = gagnantId == userId;

                    return (
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

                                {/* Message si l'enchère est terminée */}
                                {enchereTerminee && (
                                    <div
                                        className={`mt-4 p-3 rounded-md text-white font-bold text-center ${
                                            isCurrentUserWinner ? 'bg-green-600' : 'bg-red-600'
                                        }`}
                                    >
                                        {isCurrentUserWinner ? (
                                            <>🎉 Félicitations ! Vous avez gagné cette enchère.</>
                                        ) : (
                                            <>⏳ L'enchère est terminée. Un autre utilisateur a remporté cette enchère.</>
                                        )}
                                    </div>
                                )}

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
                    );
                })}
            </div>
        </div>
    );
}

export default Participation;
