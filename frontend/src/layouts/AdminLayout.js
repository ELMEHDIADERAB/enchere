import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

function AdminLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleMobileMenu = () => setMobileMenuOpen((prevState) => !prevState);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-700 shadow-md p-4 text-white relative">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-2xl font-bold tracking-wide"
          >
            <Link to="/admin/dashboard">Admin Panel</Link>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex space-x-6 items-center">
            {[
              { name: "Dashboard", path: "/admin/dashboard" },
              { name: "Utilisateurs", path: "/admin/users" },
              { name: "Catégories", path: "/admin/categories" },
              { name: "Rôles", path: "/admin/roles" },
              { name: "Produits", path: "/admin/product" }
            ].map((item) => (
              <motion.li 
                key={item.name} 
                whileHover={{ scale: 1.1 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to={item.path} className="hover:text-yellow-400 transition duration-300">
                  {item.name}
                </Link>
              </motion.li>
            ))}

            {/* User Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center hover:text-yellow-400 transition duration-300">
                <span>{user ? `${user.email} ` : "Utilisateur"}</span>
                <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>
              {dropdownOpen && (
                <motion.ul 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 py-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50"
                >
                  <li>
                    <Link to="/admin/profile" className="block px-4 py-2 hover:bg-gray-200">Profil</Link>
                  </li>
                  <li>
                    <button onClick={logout} className="block px-4 py-2 hover:bg-gray-200 w-full text-left">
                      Déconnexion
                    </button>
                  </li>
                </motion.ul>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-gray-800 shadow-md py-4 px-6 space-y-4"
        >
          {[
            { name: "Dashboard", path: "/admin/dashboard" },
            { name: "Utilisateurs", path: "/admin/users" },
            { name: "Catégories", path: "/admin/categories" },
            { name: "Rôles", path: "/admin/roles" },
            { name: "Produits", path: "/admin/product" }
          ].map((item) => (
            <Link key={item.name} to={item.path} className="block text-white hover:text-yellow-400">
              {item.name}
            </Link>
          ))}
          <button onClick={logout} className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700">
            Déconnexion
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="container mx-auto p-6 flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 p-4 text-white text-center mt-auto">© 2024 Admin Panel</footer>
    </div>
  );
}

export default AdminLayout;



/*import React from "react";
 import {Link} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
  import {useContext} from "react";

 function AdminLayout({ children }) {
     const { logout,isAuthenticated } = useContext(AuthContext);

   return (
       <div className="flex flex-col min-h-screen">
             <nav className="bg-gray-800 p-4 text-white">
                 <div className="container mx-auto flex justify-between items-center">
                   <span className="font-bold text-xl">Enchères App (Admin)</span>
                    <ul className="flex space-x-4">
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
                                <Link to="/admin/products" className="hover:text-gray-300">
                                    Products
                                  </Link>
                            </li>
                         <li>
                              <button onClick={logout} className="hover:text-gray-300">
                                     Déconnexion
                                 </button>
                           </li>

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
  export default AdminLayout;*/