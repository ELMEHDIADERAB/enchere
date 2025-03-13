import React, {useState ,useEffect} from 'react';
 import Input from '../common/Input';
 import Button from '../common/Button';
import Select from "../common/Select";
 import apiService from '../../services/apiService';

function UserForm({ initialUser = {}, onSubmit, onClose }) {
     const [user, setUser] = useState({
         nomUtilisateur:"",
        email:"",
        nom:"",
         prenom:"",
         motDePasse:"",
         adresse:"",
       tel:"",
         role:"",
          ...initialUser
    });
     const [roles, setRoles] = useState([]);
   useEffect(() => {
       if (initialUser && initialUser.role) {
            setUser({ ...initialUser, role: initialUser.role.id });
       }
  }, [initialUser]);
     useEffect(() => {
       const fetchRoles = async () => {
           try{
                const response = await apiService.get("/admin/roles");
                 setRoles(response.data);
            }catch(err){
                console.error(err);
           }
       };
      fetchRoles();
     },[]);
  const handleChange = (e) => {
         const {name , value} = e.target;
        setUser({...user, [name]:value});
    };
   const handleRoleChange = (e) => {
       const roleId = parseInt(e.target.value,10);
         setUser({...user , role : roleId});
    };

   const handleSubmit = async (e) => {
       e.preventDefault();
      console.log("User before submit:",user) //Ajouter le log
     try {
         const userToSubmit = {
             ...user,
             role: { id: user.role },
          };
           onSubmit(userToSubmit);

       } catch (err) {
          console.error("Error submitting form:", err);
       }
  };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" value={user.nomUtilisateur || ''}
                onChange={handleChange} name="nomUtilisateur"
              placeholder="Nom d'utilisateur" required/>
          <Input type="email" value={user.email || ''}
                 onChange={handleChange} name="email"
                placeholder="Email" required/>
          <Input type="text" value={user.nom || ''}
                onChange={handleChange} name="nom"
                  placeholder="Nom" required/>
           <Input type="text" value={user.prenom || ''}
                  onChange={handleChange} name="prenom"
                placeholder="Prenom" required/>
           <Input type="password" value={user.motDePasse || ''} onChange={handleChange} name="motDePasse"/>     
          <Input type="text" value={user.adresse || ''}
                  onChange={handleChange} name="adresse"
                placeholder="Adresse"/>
         <Input type="text" value={user.tel || ''}
                 onChange={handleChange} name="tel"
                placeholder="Tel"/>
           {/*<Select value={user.role || ""} onChange={handleRoleChange} options={roles} required/>*/}
           <select
    value={user.role || ""}
    onChange={(e) => setUser({ ...user, role: e.target.value })}
    required
>
    <option value="" disabled>Choisissez un rôle</option>
    {roles.map((role) => (
        <option key={role.id} value={role.id}>{role.nomRole}</option>
    ))}
</select>

        <div className="flex justify-end space-x-2">
               <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700">
                 {user && user.id ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'} {/* Utilisation du test */}
               </Button>
                <Button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
                    Annuler
                </Button>
           </div>
        </form>
   );
}
 export default UserForm;



/*import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";
import apiService from "../../services/apiService";

function UserForm({ initialUser = {}, onSubmit, onClose }) {
  // Initialisation de l'état avec des valeurs par défaut
  const [user, setUser] = useState({
    nomUtilisateur: "",
    email: "",
    nom: "",
    prenom: "",
    adresse: "",
    tel: "",
    role: "",
    ...initialUser,
  });
  const [roles, setRoles] = useState([]);

  // Mise à jour de l'état user lorsque initialUser change
  useEffect(() => {
    if (initialUser && initialUser.role) {
      setUser({ ...initialUser, role: initialUser.role.id });
    }
  }, [initialUser]);

  // Récupération des rôles depuis l'API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiService.get("/admin/roles");
        setRoles(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des rôles :", err);
      }
    };
    fetchRoles();
  }, []);

  // Gestion des changements dans les champs d'entrée
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Gestion des changements dans le champ de sélection des rôles
  const handleRoleChange = (e) => {
    const roleId = parseInt(e.target.value, 10);
    setUser((prevUser) => ({
      ...prevUser,
      role: roleId,
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User before submit:", user);
    try {
      const userToSubmit = {
        ...user,
        role: { id: user.role },
      };
      onSubmit(userToSubmit);
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire :", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={user.nomUtilisateur || ""}
        onChange={handleChange}
        name="nomUtilisateur"
        placeholder="Nom d'utilisateur"
        required
      />
      <Input
        type="email"
        value={user.email || ""}
        onChange={handleChange}
        name="email"
        placeholder="Email"
        required
      />
      <Input
        type="text"
        value={user.nom || ""}
        onChange={handleChange}
        name="nom"
        placeholder="Nom"
        required
      />
      <Input
        type="text"
        value={user.prenom || ""}
        onChange={handleChange}
        name="prenom"
        placeholder="Prénom"
        required
      />
      <Input
        type="text"
        value={user.adresse || ""}
        onChange={handleChange}
        name="adresse"
        placeholder="Adresse"
      />
      <Input
        type="text"
        value={user.tel || ""}
        onChange={handleChange}
        name="tel"
        placeholder="Téléphone"
      />
      <Select
        value={user.role || ""}
        onChange={handleRoleChange}
        options={roles}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700">
          {initialUser.id ? "Modifier Utilisateur" : "Ajouter Utilisateur"}
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

export default UserForm;



*/


/*import React, {useState ,useEffect} from 'react';
import Input from '../common/Input';
  import Button from '../common/Button';
  import Select from "../common/Select";
  import apiService from '../../services/apiService';

 function UserForm({ initialUser = {}, onSubmit, onClose }) {
     const [user, setUser] = useState(initialUser);
      const [roles, setRoles] = useState([]);
   useEffect(() => {
     if (initialUser && initialUser.role) {
         setUser({ ...initialUser, role: initialUser.role.id });
     }
   }, [initialUser]);
   useEffect(() => {
      const fetchRoles = async () => {
        try{
           const response = await apiService.get("/admin/roles");
           setRoles(response.data);
        }catch(err){
           console.error(err);
      }
 };
     fetchRoles();
  },[]);
   const handleChange = (e) => {
       const {name , value} = e.target;
       setUser({...user, [name]:value});
   };
   const handleRoleChange = (e) => {
     const roleId = parseInt(e.target.value,10);
       setUser({...user , role : roleId});
  };

   const handleSubmit = async (e) => {
     e.preventDefault();
       try {
         const userToSubmit = {
               ...user,
              role: { id: user.role },
           };
            onSubmit(userToSubmit);

      } catch (err) {
        console.error("Error submitting form:", err);
       }
  };
   return (
     <form onSubmit={handleSubmit} className="space-y-4">
         <Input type="text" value={user.nomUtilisateur || ''}
           onChange={handleChange} name="nomUtilisateur"
           placeholder="Nom d'utilisateur" required/>
         <Input type="email" value={user.email || ''}
             onChange={handleChange} name="email"
             placeholder="Email" required/>
         <Input type="text" value={user.nom || ''}
              onChange={handleChange} name="nom"
               placeholder="Nom" required/>
        <Input type="text" value={user.prenom || ''}
             onChange={handleChange} name="prenom"
              placeholder="Prenom" required/>
        <Input type="text" value={user.adresse || ''}
               onChange={handleChange} name="adresse"
               placeholder="Adresse"/>
         <Input type="text" value={user.tel || ''}
               onChange={handleChange} name="tel"
               placeholder="Tel"/>
      <Select value={user.role} onChange={handleRoleChange} options={roles} required/>
       <div className="flex justify-end space-x-2">
            <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700">
                {initialUser.id ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}
            </Button>
             <Button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
                Annuler
             </Button>
        </div>
     </form>
  );
}
export default UserForm;*/