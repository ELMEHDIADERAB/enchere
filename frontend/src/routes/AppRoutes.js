import React from 'react';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';

import Home from '../pages/Client/Home';
import Products from '../pages/Client/Products';
import Product from '../pages/Admin/Products';
import AuctionDetails from '../pages/Client/AuctionDetails';
import Dashboard from '../pages/Admin/Dashboard';
import Users from '../pages/Admin/Users';
import Categories from '../pages/Admin/Categories';
import Roles from '../pages/Admin/Roles';
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import {AuthProvider} from "../contexts/AuthContext";
import PublicRoute from "./PublicRoute";
import Enchere from '../pages/Client/Enchere';
import Participation from '../pages/Client/Participation';
import FilteredParticipationList from '../pages/Client/FilteredParticipationList';
import ClientProducts from '../pages/Client/Products'; // Import client products
import Profile from '../pages/Client/Profile';
import AdminProfile from '../pages/Admin/AdminProfile';


function AppRoutes() {
   return (
     <Router>
        <AuthProvider>
           <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />


              <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
              <Route path="/products" element={<PrivateRoute><ClientProducts/></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/auction/:id" element={<PrivateRoute><AuctionDetails /></PrivateRoute>} />
               <Route path="/enchere/:id" element={<PrivateRoute><Enchere /></PrivateRoute>} /> {/* Page de l'enchère */}
              <Route path="/participations/user" element={<PrivateRoute><Participation /></PrivateRoute>} />
              <Route path="/categories" element={<PrivateRoute><Participation /></PrivateRoute>} />
              <Route path="/user/:id/categorie/:categoryId" element={<PrivateRoute><FilteredParticipationList /></PrivateRoute>} />


              {/* Admin routes */}
               <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute><Users /></PrivateRoute>} />
              <Route path="/admin/categories" element={<PrivateRoute><Categories/></PrivateRoute>}/>
              <Route path="/admin/roles" element={<PrivateRoute><Roles/></PrivateRoute>}/>
              <Route path="/admin/product" element={<PrivateRoute><Product/></PrivateRoute>}/>
              <Route path='/admin/profile'  element={<PrivateRoute><AdminProfile/></PrivateRoute>}/>



          </Routes>
       </AuthProvider>
    </Router>
   );
}

export default AppRoutes;

/*import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom';

import Home from '../pages/Client/Home';
import Products from '../pages/Client/Products';
import AuctionDetails from '../pages/Client/AuctionDetails';
import Dashboard from '../pages/Admin/Dashboard';
import Users from '../pages/Admin/Users';
import Categories from '../pages/Admin/Categories';
import Roles from '../pages/Admin/Roles';
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import {AuthProvider} from "../contexts/AuthContext";
function AppRoutes() {
return (
<Router>
<AuthProvider>
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
<Route path="" element={
<PrivateRoute>
<Routes>
{/ Client routes */
/*<Route path="/products" element={<Products />} />
<Route path="/auction/:id" element={<AuctionDetails />} />

{/* Admin routes *//*}   <Route path="/admin/dashboard" element={ <Dashboard /> } />
                          <Route path="/admin/users" element={ <Users /> } />
                            <Route path="/admin/categories" element={<Categories/>}/>
                          <Route path="/admin/roles" element={<Roles/>}/>
                        </Routes>
                   </PrivateRoute>
               } />
            </Routes>
       </AuthProvider>
     </Router>
  );
}
export default AppRoutes;
*/