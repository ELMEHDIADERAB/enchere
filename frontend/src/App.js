/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './index.css';
import { ToastContainer } from 'react-toastify';
import '../src/App.css';

import 'react-toastify/dist/ReactToastify.css';

function App() {
    console.log("app.js is rendered") // Ajout de log
   return (
    <div>
    {/* Routes de l'application */}
    
    <AppRoutes />
    {/* Composant ToastContainer pour afficher les notifications toast */}
    <ToastContainer />
</div>
   );
 }

   export default App;