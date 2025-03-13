import React from 'react';
import Button from "../common/Button";

function RoleList({ roles, handleEdit, handleDelete}) {
  return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
             <tr className="text-left">
               <th className="py-2 px-4 border-b">ID</th>
               <th className="py-2 px-4 border-b">Nom Rôle</th>
               <th className="py-2 px-4 border-b">Actions</th>
             </tr>
           </thead>
           <tbody>
             {roles && roles.map((role) => (
              <tr key={role.id}  className="hover:bg-gray-50">
                   <td className="py-2 px-4 border-b">{role.id}</td>
                  <td className="py-2 px-4 border-b">{role.nomRole}</td>
                   <td className="py-2 px-4 border-b flex space-x-2">
                      <Button onClick={() => handleEdit(role)} className="bg-blue-500 text-white hover:bg-blue-700">
                         Modifier
                     </Button>
                    <Button onClick={() => handleDelete(role.id)} className="bg-red-500 text-white hover:bg-red-700">
                        Supprimer
                     </Button>
                 </td>
             </tr>
              ))}
          </tbody>
      </table>
     </div>
   );
 }
 export default RoleList;