import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';


function RoleForm({ initialRole = {}, onSubmit, onClose }) {
    const [role, setRole] = useState(initialRole);
    const handleChange = (e) => {
       const {name , value} = e.target;
       setRole({...role, [name]:value});
   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(role);
 };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <Input type="text" value={role.nomRole || ''}
           onChange={handleChange} name="nomRole"
           placeholder="Nom Role" required/>

        <div className="flex justify-end space-x-2">
           <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700">
               {initialRole.id ? 'Modifier Role' : 'Ajouter Role'}
           </Button>
         <Button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
              Annuler
            </Button>
         </div>
     </form>
  );
}
export default RoleForm;