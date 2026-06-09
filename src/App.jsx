import React from 'react';
import { CarProvider } from './context/CarContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CarTable from './components/CarTable';
import CarForm from './components/CarForm';
import CarDetail from './components/CarDetail';
import ConfirmDelete from './components/ConfirmDelete';
import Toast from './components/Toast';
import MapView from './components/MapView';


function App() {
  return (
    <CarProvider>
      <div className="App">
        {/* Barra superior con marca del proyecto, geolocalizacion y cambio de tema. */}
        <Navbar />
        <main className="container my-4">
          {/* Resumen numerico de la coleccion y conversiones de moneda. */}
          <Dashboard />
          {/* Mapa interactivo con marcadores agrupados por pais. */}
          <MapView />
          {/* Tabla principal para consultar, buscar y administrar automoviles. */}
          <CarTable />
        </main>
        <footer className="text-center text-muted small py-3">
         DTW135 GT01
        </footer>
        {/* Modales y notificaciones globales controlados desde el contexto. */}
        <CarForm />
        <CarDetail />
        <ConfirmDelete />
        <Toast />
      </div>
    </CarProvider>
  );
}

export default App;
