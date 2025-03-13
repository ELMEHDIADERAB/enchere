import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

function ClientLayout({ children }) {
  const { logout, isAuthenticated, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: categories } = useFetch("/client/categories");
  const userId = localStorage.getItem("userId");

  const categoriesRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-md p-4 text-white relative">
        <div className="container mx-auto flex justify-between items-center">
        <motion.div 
  initial={{ y: -20, opacity: 0 }} 
  animate={{ y: 0, opacity: 1 }} 
  transition={{ type: "spring", stiffness: 120 }}
>
  <Link to="/" className="text-2xl font-bold tracking-wide">
  Marketplace des Enchères
  </Link>
</motion.div>


          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 items-center">
            {isAuthenticated() && (
              <>
                <li>
                  <Link to="/" className="hover:text-yellow-400 transition duration-300">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-yellow-400 transition duration-300">
                    Produits
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated() && (
              <li className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Catégories
                </button>
                {isOpen && (
                  <motion.ul 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 py-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50"
                  >
                    <li>
                      <Link to="/categories" className="block px-4 py-2 hover:bg-gray-200">Toutes</Link>
                    </li>
                    {categories?.map((option) => (
                      <li key={option.id}>
                        <Link to={`/user/${userId}/categorie/${option.id}`} className="block px-4 py-2 hover:bg-gray-200">
                          {option.nomCategorie}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </li>
            )}
            {isAuthenticated() ? (
              <>
                <li>
                  <Link to="/participations/user" className="hover:text-yellow-400 transition duration-300">
                    Mes Participations
                  </Link>
                </li>
                <li className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center hover:text-yellow-400 transition duration-300"
                  >
                    {user?.email}
                    <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </button>
                  {isProfileOpen && (
                    <motion.ul 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 py-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50"
                    >
                      <li>
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Profil</Link>
                      </li>
                      <li>
                        <button onClick={logout} className="block px-4 py-2 hover:bg-gray-200 w-full text-left">
                          Déconnexion
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-yellow-400 transition duration-300">
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-yellow-400 transition duration-300">
                    S'inscrire
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6 flex-grow">{children}</main>
      <footer className="bg-gray-900 p-4 text-white text-center mt-auto">© 2024 Enchères Pro</footer>
    </div>
  );
}

export default ClientLayout;



/*import React, { useContext ,useState,useEffect} from "react";
import {Link} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";

function ClientLayout({ children }) {
    const { logout,isAuthenticated } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
     const { data: categories} = useFetch("/admin/categories");
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
                       <li className="relative">
                            <button onClick={() => setIsOpen(!isOpen)}  className="hover:text-gray-300">
                                 Categories
                             </button>
                             {isOpen &&  (
                                <ul className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl">
                                   <li>
                                     <Link to="/products" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                          All
                                      </Link>
                                     </li>
                                 {categories && categories.map((option) => (
                                    <li key={option.id}>
                                       <Link to={`/products/categorie/${option.id}`}  className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                          {option.nomCategorie}
                                       </Link>
                                    </li>
                                 ))}
                            </ul>
                        )}

                       </li>
                     {isAuthenticated() &&
                       <>
                           <li>
                              <Link to="/participations/user" className="hover:text-gray-300">
                                     Mes participations
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
  export default ClientLayout;*/



/*import React from "react";
import {Link} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
import {useContext} from "react";

function ClientLayout({ children }) {
  const { logout,isAuthenticated} = useContext(AuthContext);

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
                                   <Link to="/participations/user" className="hover:text-gray-300">
                                      Mes participations
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
 export default ClientLayout;*/