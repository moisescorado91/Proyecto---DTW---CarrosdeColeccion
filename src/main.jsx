import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';
import './App.css';
import App from './App';

// Punto de entrada de la aplicacion.
// Aqui se crea la raiz de React y se monta el componente principal dentro del elemento #root.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode ayuda a detectar patrones inseguros durante el desarrollo sin afectar el build final.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
