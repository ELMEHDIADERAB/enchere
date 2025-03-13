import React, { useState, useEffect } from 'react';
import useFetch from "../../hooks/useFetch";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function Dashboard() {
    const { data: users, loading: loadingUsers, error: errorUsers } = useFetch("/admin/users");
    const { data: products, loading: loadingProducts, error: errorProducts } = useFetch("/admin/products");
    const { data: encheres, loading: loadingEncheres, error: errorEncheres } = useFetch("/client/encheres");
    const { data: categories, loading: loadingCategories, error: errorCategories } = useFetch("/admin/categories");
    const { data: enchereCounts, loading: loadingEnchereCounts, error: errorEnchereCounts } = useFetch("/admin/encheres/countByStatus");
    const { data: expiringAuctions, loading: loadingExpiringAuctions, error: errorExpiringAuctions } = useFetch("/admin/encheres/expiringSoon");
    useEffect(() => {
        document.title = "Dashboard - Admin Panel";
    }, []);
    

    if (loadingUsers || loadingProducts || loadingEncheres || loadingCategories || loadingEnchereCounts || loadingExpiringAuctions) {
        return <div className="flex items-center justify-center h-64">Chargement ...</div>;
    }
    if (errorUsers || errorProducts || errorEncheres || errorCategories || errorEnchereCounts || errorExpiringAuctions) {
        return <div>Error : ....</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "MMMM dd HH:mm", { locale: fr });
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Tableau de bord de l'administrateur</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded shadow-md border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Utilisateurs</h3>
                    <p className="text-3xl font-bold text-blue-500">{users ? users.length : 0}</p>
                </div>

                <div className="bg-white p-5 rounded shadow-md border-l-4 border-green-500">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Produits</h3>
                    <p className="text-3xl font-bold text-green-500">{products ? products.length : 0}</p>
                </div>

                <div className="bg-white p-5 rounded shadow-md border-l-4 border-yellow-500">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Enchères en Cours</h3>
                    <p className="text-3xl font-bold text-yellow-500">{encheres ? encheres.length : 0}</p>
                </div>
                <div className="bg-white p-5 rounded shadow-md border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Catégories</h3>
                    <p className="text-3xl font-bold text-red-500">{categories ? categories.length : 0}</p>
                </div>
            </div>

            {/* Section Enchères Expirant Bientôt */}
            <div className="bg-white p-6 rounded shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Enchères Expirant Bientôt</h3>
                <table className="min-w-full bg-white border border-gray-300 rounded-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Produit</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date de Fin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expiringAuctions && expiringAuctions.length > 0 ? (
                            expiringAuctions.map((auction) => (
                                <tr key={auction.id} className="border-b">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{auction.product.nomProduit}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(auction.dateFin)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="px-6 py-4 text-sm text-center text-gray-500">Aucune enchère expirant bientôt</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;
