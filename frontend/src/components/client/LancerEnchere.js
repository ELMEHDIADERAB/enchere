import React, { useState } from 'react';

function LancerEnchere({ productId }) {
  const [dateFin, setDateFin] = useState(new Date());

    const handleSubmit = async (e) => {
      e.preventDefault();

      const isoDate = dateFin.toISOString().replace(/\.\d{3}Z$/,'Z');


      try{
      const response = await fetch(`/api/client/encheres/lancer/${productId}?dateFin=${isoDate}`, {
        method: 'POST',
      });

     if (response.ok) {
        alert("Enchère lancée avec succès !");
      } else if (response.status === 409) {
        const data = await response.json()
        alert(data.message);
      }else {
          const data = await response.json()
          console.log("Error :", data);
          alert("Erreur lors du lancement de l'enchère.");
      }
     }catch (error) {
        console.error("Error launching auction:", error);
         alert("Erreur lors du lancement de l'enchère.");
     }
    };


  return (
    <form onSubmit={handleSubmit} className="mt-4">

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Date de fin</label>
          <input
            type="datetime-local"
            value={dateFin.toISOString().slice(0, 16)}
             onChange={(e) => setDateFin(new Date(e.target.value))}
            className="mt-1 p-2 border rounded w-full"
            required
          />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Lancer l'enchère
      </button>
    </form>
  );
}

function ProductCard({ product }) {
  return (
    <div className="product-card p-6 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
      <div className="relative">
        {product.images && (
          <img
            src={`/images/${product.images}`}
            alt={product.nomProduit}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {product.isAuctionActive ? 'Enchère en cours' : 'Vente terminée'}
        </div>
      </div>
      <h3 className="font-semibold text-xl mt-4 mb-2">{product.nomProduit}</h3>
      <p className="text-gray-700 mb-3">{product.description}</p>
      <p className="font-bold text-xl text-blue-600">{product.prix} DHx</p>
      <LancerEnchere productId={product.id} />
    </div>
  );
}

export default ProductCard;