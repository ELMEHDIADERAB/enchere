import React, { useState, useEffect } from 'react';
import Button from "../common/Button";

function CategoryForm({ initialCategory, onSubmit, onClose }) {
    const [category, setCategory] = useState({ nomCategorie: "" });

    // Mettre à jour les champs du formulaire lorsque `initialCategory` change
    useEffect(() => {
        if (initialCategory) {
            setCategory(initialCategory);
        } else {
            setCategory({ nomCategorie: "" });
        }
    }, [initialCategory]);

    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (category.nomCategorie.trim() === "") {
            alert("Le nom de la catégorie est requis !");
            return;
        }
        onSubmit(category);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Nom de la catégorie :</label>
                <input
                    type="text"
                    name="nomCategorie"
                    value={category.nomCategorie}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button onClick={onClose} className="bg-gray-500 text-white hover:bg-gray-700">
                    Annuler
                </Button>
                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700">
                    Confirmer
                </Button>
            </div>
        </form>
    );
}

export default CategoryForm;
