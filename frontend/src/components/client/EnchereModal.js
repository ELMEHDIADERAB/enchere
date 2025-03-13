import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

function EnchereModal({ isOpen, onClose, product }) {
    const { token } = useAuth();
    const [dateFin, setDateFin] = useState('');


    const handleDateChange = (e) => {
        setDateFin(e.target.value);
    };

     const handleSubmit = async () => {
         if(!dateFin){
             alert("Veuillez choisir une date de fin");
            return;
         }
         console.log("Date to send: ", dateFin);
        try {
            const dateFinParsed = new Date(dateFin)
            const response = await apiService.post(`/client/encheres/lancer/${product.id}`,null , {
                 params: {
                     prixDepart: product.prix,
                      dateFin: dateFinParsed.toISOString()
                  },
                    headers: {
                     'Authorization': `Bearer ${token}`,
                    }
             });
            if(response.status === 201){
              toast.success("L'enchère a été lancée avec succès !");
                onClose();
            }else{
                toast.error("Une erreur s'est produite lors du lancement de l'enchère. Veuillez réessayer.");
            }


         } catch (error) {
           console.error("Error launching auction:", error);
            toast.error("Une erreur s'est produite lors du lancement de l'enchère. Veuillez réessayer.");
        }
    };
      if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-lg w-11/12 md:w-2/3">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Lancer une Enchère</h2>
                  <div className="mb-4">
                       <p>Prix de départ: {product.prix} DH</p>
                  </div>
                 <div className="mb-4">
                    <Input
                       type="datetime-local"
                       placeholder="Date de fin"
                        value={dateFin}
                       onChange={handleDateChange}
                       required
                        />
                 </div>

               <div className="flex justify-end space-x-2">
                    <Button onClick={handleSubmit} className="bg-blue-500 text-white hover:bg-blue-700">
                            Lancer
                    </Button>
                    <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
                       Annuler
                    </Button>
               </div>
            </div>
        </div>
    );
}

export default EnchereModal;