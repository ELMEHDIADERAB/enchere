import React from "react";
import {Link} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
import {useContext} from "react";

function MainLayout({ children }) {
    const { logout,isAuthenticated } = useContext(AuthContext);

     return (
         <div className="flex flex-col min-h-screen">
            <nav className="bg-gray-800 p-4 text-white">
                 <div className="container mx-auto flex justify-between items-center">
                   <span className="font-bold text-xl">Enchères App</span>
                    <ul className="flex space-x-4">
                        <li>
                           <Link to="/" className="hover:text-gray-300">
                              Home
                             </Link>
                         </li>
                         <li>
                             <Link to="/products" className="hover:text-gray-300">
                                 Products
                             </Link>
                        </li>
                        {isAuthenticated() &&
                            <>
                             <li>
                                  <Link to="/admin/dashboard" className="hover:text-gray-300">
                                       Dashboard   
                                  </Link>
                               </li>
                                <li>
                                   <Link to="/admin/users" className="hover:text-gray-300">
                                      Users
                                  </Link>
                                </li>
                                <li>
                                   <Link to="/admin/categories" className="hover:text-gray-300">
                                     Categories
                                   </Link>
                                </li>
                                 <li>
                                     <Link to="/admin/roles" className="hover:text-gray-300">
                                          Roles
                                     </Link>
                               </li>
                               <li>
                                  <button onClick={logout} className="hover:text-gray-300">
                                       Déconnexion
                                  </button>
                              </li>
                           </>
                       }
                  </ul>
              </div>
         </nav>

         <main className="container mx-auto p-4 flex-grow">{children}</main>

            <footer className="bg-gray-800 p-4 text-white text-center">
                 © 2024 Enchères App
            </footer>
       </div>
     );
}
export default MainLayout;