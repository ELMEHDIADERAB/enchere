import React from 'react';
import Button from "../common/Button";

function UserList({ users, handleEdit, handleDelete ,handleActivate, handleDeactivate}) {
   return (
       <div className="overflow-x-auto">
           <table className="min-w-full bg-white border border-gray-300 rounded-md">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Nom Utilisateur</th>
                    <th className="py-2 px-4 border-b">Email</th>
                   <th className="py-2 px-4 border-b">Nom</th>
                  <th className="py-2 px-4 border-b">Prenom</th>
                  <th className="py-2 px-4 border-b">Adresse</th>
                    <th className="py-2 px-4 border-b">Tel</th>
                  <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{user.id}</td>
                         <td className="py-2 px-4 border-b">{user.nomUtilisateur}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.nom}</td>
                        <td className="py-2 px-4 border-b">{user.prenom}</td>
                        <td className="py-2 px-4 border-b">{user.adresse}</td>
                       <td className="py-2 px-4 border-b">{user.tel}</td>
                         <td className="py-2 px-4 border-b">{user.isActive ? "Active": "Inactive"}</td>
                        <td className="py-2 px-4 border-b flex space-x-2">
                             <Button onClick={() => handleEdit(user)} className="bg-blue-500 text-white hover:bg-blue-700">
                                 Modifier
                             </Button>
                             <Button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white hover:bg-red-700">
                                Supprimer
                             </Button>
                           {user.isActive?
                               <Button onClick={() => handleDeactivate(user.id)} className="bg-yellow-500 text-white hover:bg-yellow-700">
                                  Désactiver
                              </Button>
                               :
                              <Button onClick={() => handleActivate(user.id)} className="bg-green-500 text-white hover:bg-green-700">
                                   Activer
                                </Button>
                              }


                        </td>
                    </tr>
                ))}
             </tbody>
            </table>
       </div>
    );
 }
export default UserList;