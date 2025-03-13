/*import React, { createContext, useState, useCallback, useEffect } from 'react';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  const [token , setToken] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
       const storedToken = localStorage.getItem('token');
        if(storedUser && storedToken){
            try{
                 setUser(JSON.parse(storedUser))
                 setToken(storedToken);
             }catch(error){
               console.error("Error parsing user from localStorage : ", error)
               localStorage.removeItem('user')
               localStorage.removeItem('token');
           }
       }
 },[]);
  const login = useCallback(async (email,motDePasse) =>{
     try{
           console.log("appel de l'api avec ",{email,motDePasse})
           const response =  await apiService.post("/auth/login",{email, motDePasse});
         const token = response.data.token;
          const role = response.data.role; // Récupérer le role depuis la réponse
           console.log(token, role); // log du token
             setToken(token);
            setUser({email, role}); // Stocker le role
            localStorage.setItem('user', JSON.stringify({email, role}));
           localStorage.setItem('token',token);
       }catch(error){
           setUser(null);
        localStorage.removeItem('user');
         localStorage.removeItem('token');
          console.error("Login failed : ", error)
            throw new Error("Nom d'utilisateur ou mot de passe incorrect");
      }

    },[]);
   const logout = useCallback(() => {
        setUser(null);
       localStorage.removeItem('user');
        localStorage.removeItem('token')
       navigate("/login");
   },[navigate]);
    const isAuthenticated = () =>{
       return !!user;
   };

  return (
        <AuthContext.Provider value={{ user, login, logout,isAuthenticated ,token }}>
             {children}
       </AuthContext.Provider>
   );
};
*/



import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    const [authInitialized, setAuthInitialized] = useState(false);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
    
        if (storedUser && storedToken) {
            try {
                const user = JSON.parse(storedUser);
                console.log("Stored User from LocalStorage: ", user); // Vérification
                setUser(user);  // Récupère l'utilisateur complet (avec nom, prénom, etc.)
                setToken(storedToken);
                setAuthInitialized(true);
            } catch (error) {
                console.error("Error parsing user from localStorage: ", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } else {
            setAuthInitialized(true);
        }
    }, []);
    
    /*
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const user = JSON.parse(storedUser);
                setUser(user);
                setToken(storedToken);
                setAuthInitialized(true);

            } catch (error) {
                console.error("Error parsing user from localStorage: ", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }else {
            setAuthInitialized(true);

        }
    }, []);*/
    const login = useCallback(async (email, motDePasse) => {
        try {
            const response = await apiService.post("/auth/login", { email, motDePasse });
            const { token, role, user: userId, nom, prenom } = response.data;
            console.log("Login response:", response.data); // Vérifiez que nom et prenom sont présents
    
            if (!userId) {
                console.error('User ID is missing in the response');
                throw new Error('User ID missing');
            }
    
            setToken(token);
            setUser({ email, role, userId, nom, prenom });
            localStorage.setItem('user', JSON.stringify({ email, role, userId, nom, prenom }));
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
    
            return { email, role, userId, nom, prenom };
        } catch (error) {
            console.error("Login failed: ", error);
            setUser(null);
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            throw new Error("Nom d'utilisateur ou mot de passe incorrect");
        }
    }, []);
    
    
   /*onst login = useCallback(async (email, motDePasse) => {
        try {
            const response = await apiService.post("/auth/login", { email, motDePasse });
            const token = response.data.token;
            const role = response.data.role;
            const userId = response.data.user;
             console.log('user after login:', { email,  userId });
            if (!userId) {
                console.error('User ID is missing in the response');
                throw new Error('User ID missing');
            }

            setToken(token);
            setUser({ email, role, userId });
            localStorage.setItem('user', JSON.stringify({ email, role, userId }));
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);


             return { email, role, userId };
        } catch (error) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            console.error("Login failed: ", error);
            throw new Error("Nom d'utilisateur ou mot de passe incorrect");
        }
    }, []);*/

    const register = useCallback(async (email, motDePasse, nom, prenom) => {
        try {
            const response = await apiService.post("/auth/register", { email, motDePasse, nom, prenom });

            if (response.status === 201) {
                 const token = response.data.token;
                const role = response.data.role;
                const userId = response.data.user;
                 console.log('user after register:', { email, role, userId });

                if (!userId) {
                    console.error('User ID is missing or invalid');
                    return;
                }
                // Rediriger vers la page de connexion après une inscription réussie
               await navigate("/login");


                setToken(token);
                setUser({ email, role, userId });
                localStorage.setItem('user', JSON.stringify({ email, role,userId }));
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);


            }
        } catch (error) {
             setUser(null);
             setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
             localStorage.removeItem('userId');
            console.error("Registration failed: ", error);
             throw new Error("Erreur lors de l'inscription");
        }
    }, [navigate]);

    const logout = useCallback(() => {
         setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
         navigate("/login");
    }, [navigate]);


    const isAuthenticated = () => {
        return !!user;
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, token, register, authInitialized }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  return useContext(AuthContext);
};


/*import React, { createContext, useState, useCallback, useEffect } from 'react';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [token , setToken] = useState(null);
const navigate = useNavigate();
useEffect(() => {
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');
if(storedUser && storedToken){
try{
setUser(JSON.parse(storedUser))
setToken(storedToken);
}catch(error){
console.error("Error parsing user from localStorage : ", error)
localStorage.removeItem('user')
localStorage.removeItem('token');
}
}
},[]);
const login = useCallback(async (email,motDePasse) =>{
try{
console.log("appel de l'api avec ",{email,motDePasse})
const response = await apiService.post("/auth/login",{email, motDePasse});
const token = response.data.token;
const role = response.data.role; // Récupérer le role depuis la réponse
console.log(token, role); // log du role
setToken(token);
setUser({email, role}); // Stocker le role
localStorage.setItem('user', JSON.stringify({email, role})); // stocker le role
localStorage.setItem('token',token);
}catch(error){
setUser(null);
localStorage.removeItem('user');
localStorage.removeItem('token');
console.error("Login failed : ", error)
throw new Error("Nom d'utilisateur ou mot de passe incorrect");
}

},[]);
  const logout = useCallback(() => {
       setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token')
      navigate("/login");
    },[navigate]);
    const isAuthenticated = () =>{
        return !!user;
  };

   return (
       <AuthContext.Provider value={{ user, login, logout,isAuthenticated ,token }}>
           {children}
       </AuthContext.Provider>
    );
};*/




/*import React, { createContext, useState, useCallback, useEffect } from 'react';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token , setToken] = useState(null);
   const navigate = useNavigate();
    useEffect(() => {
       const storedUser = localStorage.getItem('user');
     const storedToken = localStorage.getItem('token');
     if(storedUser && storedToken){
          try{
               setUser(JSON.parse(storedUser))
               setToken(storedToken);
            }catch(error){
              console.error("Error parsing user from localStorage : ", error)
              localStorage.removeItem('user')
              localStorage.removeItem('token');
            }
        }
    },[]);
   const login = useCallback(async (email,motDePasse) =>{
      try{
         console.log("appel de l'api avec ",{email,motDePasse})
            const response =  await apiService.post("/auth/login",{email, motDePasse});
           const token = response.data.token;
          console.log(token);
           setToken(token);
          setUser({email, role : "ADMIN"});
          localStorage.setItem('user', JSON.stringify({email, role : "ADMIN"}));
            localStorage.setItem('token',token);
        }catch(error){
            setUser(null);
          localStorage.removeItem('user');
           localStorage.removeItem('token');
           console.error("Login failed : ", error)
         throw new Error("Nom d'utilisateur ou mot de passe incorrect");
        }

   },[]);
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
       localStorage.removeItem('token')
     navigate("/login");
  },[navigate]);
    const isAuthenticated = () =>{
        return !!user;
  };

    return (
       <AuthContext.Provider value={{ user, login, logout,isAuthenticated ,token }}>
            {children}
      </AuthContext.Provider>
   );
};*/
