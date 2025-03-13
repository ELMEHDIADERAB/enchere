import React from 'react';
import Button from "../common/Button";

function CategoryList({ categories, handleEdit, handleDelete }) {
    return (
       <div className="overflow-x-auto">
         <table className="min-w-full bg-white border border-gray-300 rounded-md">
             <thead className="bg-gray-100">
                 <tr className="text-left">
                   <th className="py-2 px-4 border-b">ID</th>
                   <th className="py-2 px-4 border-b">Nom Catégorie</th>
                   <th className="py-2 px-4 border-b">Actions</th>
                 </tr>
             </thead>
            <tbody>
            {categories && categories.length > 0 ? (
                categories.map((category) => (
                    <tr key={category.id || Math.random()} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{category.id}</td>
                        <td className="py-2 px-4 border-b">{category.nomCategorie}</td>
                        <td className="py-2 px-4 border-b flex space-x-2">
                            <Button onClick={() => handleEdit(category)} className="bg-blue-500 text-white hover:bg-blue-700">
                                Modifier
                            </Button>
                            <Button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white hover:bg-red-700">
                                Supprimer
                            </Button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="3" className="text-center py-4">Aucune catégorie disponible</td>
                </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryList;
