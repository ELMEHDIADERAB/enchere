/*import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import ClientLayout from '../layouts/ClientLayout';

function PrivateRoute({ children }) {
  const { isAuthenticated, user, authInitialized } = useContext(AuthContext);
  const location = useLocation();


  if(!authInitialized) {
      return null;
  }
  if (!isAuthenticated()) {
    if(location.pathname === "/"){
      return  <ClientLayout>{children}</ClientLayout>
    }
     return <Navigate to="/login" state={{ from: location }} />;
}

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} />;
    }


    if (user && user.role && user.role.includes('ADMIN')) {
        return <AdminLayout>{children}</AdminLayout>;
    } else {
        return <ClientLayout>{children}</ClientLayout>;
    }
}

export default PrivateRoute;*/
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import ClientLayout from '../layouts/ClientLayout';

function PrivateRoute({ children }) {
  const { isAuthenticated, user, authInitialized } = useContext(AuthContext);
  const location = useLocation();


  if(!authInitialized) {
      return null;
  }

    if (!isAuthenticated()) {
         if(location.pathname === "/" ){
           return  <ClientLayout>{children}</ClientLayout>
         }
          return <Navigate to="/login" state={{ from: location }} />;
    }


    if (user && user.role && user.role.includes('ADMIN')) {
        return <AdminLayout>{children}</AdminLayout>;
    } else {
        return <ClientLayout>{children}</ClientLayout>;
    }
}

export default PrivateRoute;

/*import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
  import { AuthContext } from '../contexts/AuthContext';
  import MainLayout from "../layouts/MainLayout";
 import AdminLayout from "../layouts/AdminLayout";
  import ClientLayout from "../layouts/ClientLayout";

 function PrivateRoute({ children, path, ...rest }) {
     const { isAuthenticated, user } = useContext(AuthContext);
      const location = useLocation();
   console.log("PrivateRoute is called , authenticated : ",isAuthenticated(), " , path : ", location.pathname); //ajout de log
     if(isAuthenticated()){
         if (user.role === 'ADMIN') {
             return   <AdminLayout>{children}</AdminLayout>
       } else {
            return <ClientLayout>{children}</ClientLayout>;
         }
   }else {
      if(location.pathname.startsWith("/client")){
          return   <ClientLayout>{children}</ClientLayout>
      }else{
           return  <Navigate to="/login" state={{from : location}}/>
        }
    }

}
  export default PrivateRoute;*/

/*import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
  import AdminLayout from "../layouts/AdminLayout"; //Suppression de MainLayout
 import ClientLayout from "../layouts/ClientLayout";
function PrivateRoute({ children, path, ...rest }) {
     const { isAuthenticated, user } = useContext(AuthContext);
   const location = useLocation();
     if(isAuthenticated()){
         if (user.role === 'ADMIN') {
              return   <AdminLayout>{children}</AdminLayout>
         } else {
             return <ClientLayout>{children}</ClientLayout>;
          }
     }else {
          if(path && path.startsWith("/client")){
            return   <ClientLayout>{children}</ClientLayout>
         }else{
             return  <Navigate to="/login" state={{from : location}}/>
        }
     }

}
 export default PrivateRoute;*/