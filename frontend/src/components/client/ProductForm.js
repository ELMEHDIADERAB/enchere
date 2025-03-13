import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from "../common/Select";
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

function ProductForm({ initialProduct = null, onSubmit, onClose }) {
    const [product, setProduct] = useState(() => {
        return initialProduct ? {
            nomProduit: initialProduct.nomProduit || '',
            description: initialProduct.description || '',
            prix: initialProduct.prix || 0,
            categorie: initialProduct.categorie ? initialProduct.categorie.id : null,
             images: initialProduct.images || null
        } : {
            nomProduit: '',
            description: '',
            prix: '',
            categorie: null,
            images: null
        };
    });
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(!!initialProduct);
    const { token } = useAuth();
    const [imagePreview, setImagePreview] = useState(null);
     const [fileInputKey, setFileInputKey] = useState(Date.now());
     const [currentImage, setCurrentImage] = useState(null);


    useEffect(() => {
         if (initialProduct) {
              setProduct({
                   nomProduit: initialProduct.nomProduit || '',
                   description: initialProduct.description || '',
                   prix: initialProduct.prix || 0,
                   categorie: initialProduct.categorie ? initialProduct.categorie.id : null,
                   images: initialProduct.images || null
                })
             if(initialProduct.images){
                    setImagePreview(`/images/${initialProduct.images}`);
                    setCurrentImage(initialProduct.images);

             }
         }
    }, [initialProduct]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiService.get("/client/categories");
                setCategories(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleCategoryChange = (e) => {
        const categoryId = parseInt(e.target.value, 10);
        setProduct({ ...product, categorie: categoryId });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    
        if (selectedFile) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(selectedFile);
        } else {
          setImagePreview(null);
        }
      };


     const handleResetFile = () => {
         setFile(null);
        setImagePreview(null);
         setFileInputKey(Date.now());
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const userId = localStorage.getItem('userId');
        const userIdInt = parseInt(userId, 10);

        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify({
            id: isEditing ? initialProduct.id : null,
            nomProduit: product.nomProduit,
            description: product.description,
            prix: parseFloat(product.prix),
            categorie: { id: product.categorie },
            user: { id: userIdInt }
        })], { type: 'application/json' }));


        if (file) {
            formData.append('file', file);
        } else if (currentImage) {
             formData.append('currentImage', currentImage);
        }


        if (!token) {
            console.log('Token manquant');
            return;
        }

        try {
           let response;
             if (isEditing && initialProduct.id) {
               response = await apiService.put(`/client/products/${initialProduct.id}`, formData, {
                   headers: {
                     'Authorization': `Bearer ${token}`,
                     'Content-Type': 'multipart/form-data',
                   },
               });

              } else {
                 response =  await apiService.post('/client/Addproducts', formData, {
                     headers: {
                       'Authorization': `Bearer ${token}`,
                       'Content-Type': 'multipart/form-data',
                     },
                 });
              }

            if(response.status === 201 || response.status === 200){
                 onSubmit(response.data, isEditing);
            }else{
                throw new Error('Request failed with status ' + response.status);
             }

        } catch (err) {
            console.error("Erreur lors de l'ajout/modification du produit :", err.response?.data || err.message);
            alert("Une erreur s'est produite lors de l'ajout/modification du produit.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="text"
                value={product.nomProduit || ''}
                onChange={handleChange}
                name="nomProduit"
                placeholder="Nom du produit"
                required
            />
            <Input
                type="text"
                value={product.description || ''}
                onChange={handleChange}
                name="description"
                placeholder="Description"
                required
            />
            <Input
                type="text"
                value={product.prix || 0}
                onChange={handleChange}
                name="prix"
                placeholder="Prix"
                required
            />
            <Select
                value={product.categorie || ''}
                onChange={handleCategoryChange}
                options={categories}
                required
            />
               <Input
                key={fileInputKey}
               type="file"
               onChange={handleFileChange}
               accept="image/*"
               placeholder="Ajouter une image"
                />
                   {imagePreview && (
                        <div style={{position:'relative'}}>
                        <img
                          src={imagePreview}
                           alt="Preview"
                          style={{maxWidth:'100px', maxHeight: '100px', marginTop: '10px'}}
                        />
                      <button type="button" onClick={handleResetFile} style={{position: 'absolute', top: '0px', right: '0px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius:'50%'}}>X</button>
                       </div>
                  )}


            <div className="flex justify-end space-x-2">
                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700">
                    {isEditing ? 'Modifier Produit' : 'Ajouter Produit'}
                </Button>
                <Button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400"
                >
                    Annuler
                </Button>
            </div>
        </form>
    );
}

export default ProductForm;