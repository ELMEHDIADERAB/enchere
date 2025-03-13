import React from 'react';

function ExpiringAuctionsList({ expiringAuctions }) {
  return (
      <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
               <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                     <th className="py-2 px-4 border-b">Nom Produit</th>
                    <th className="py-2 px-4 border-b">Date de Fin</th>
               </tr>
            </thead>
             <tbody>
                {expiringAuctions && expiringAuctions.map((auction) => (
                    <tr key={auction.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{auction.id}</td>
                       <td className="py-2 px-4 border-b">{auction.product.nomProduit}</td>
                        <td className="py-2 px-4 border-b">{new Date(auction.dateFin).toLocaleDateString()}</td>
                   </tr>
               ))}
            </tbody>
        </table>
   </div>
  );
}

export default ExpiringAuctionsList;