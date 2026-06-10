import React, { useState, useEffect } from 'react';
import { useCarContext } from '../context/CarContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTheme } from '../hooks/useTheme';
import { deleteCookie } from '../services/auth';

// Barra de navegacion principal.
function Navbar() {
  const { showToast } = useCarContext();
  const { location, error, requestLocation } = useGeolocation();
  const { theme, toggleTheme } = useTheme();

  // Solicita al navegador la ubicacion del usuario al presionar el boton correspondiente.
  const handleGeoClick = () => {
    requestLocation();
  };

  const logout = () => {
    deleteCookie('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    // Muestra retroalimentacion cuando la geolocalizacion se obtiene o falla.
    if (location) {
      showToast(`Ubicación obtenida: ${location.lat}, ${location.lng}`, 'info');
    }
    if (error) {
      showToast(error, 'warning');
    }
  }, [location, error, showToast]);

  return (
   <nav 
    className={`navbar navbar-expand-lg sticky-top shadow-sm ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}
    style={{
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)', // Soporte para Safari
      backgroundColor: theme === 'dark' ? 'rgba(24, 24, 27, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
      zIndex: 1050 
    }}
  >
    <div className="container px-4">
      
      <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
        <div 
          className={`p-2 rounded-3 d-inline-flex ${theme === 'dark' ? 'bg-secondary bg-opacity-25 text-white' : 'bg-dark text-white'}`}
        >
          <i className="bi bi-car-front-fill fs-5"></i>
        </div>
        <span>Garaje de Colección</span>
      </a>

      {/* Acciones del lado derecho */}
      <div className="d-flex align-items-center gap-3">
        
        <div 
          className={`d-none d-sm-flex align-items-center gap-2 px-3 py-1.5 rounded-pill small ${
            theme === 'dark' ? 'bg-light bg-opacity-10 text-light' : 'bg-secondary bg-opacity-10 text-dark'
          }`} 
          style={{ border: '1px solid rgba(120,120,120,0.15)' }}
        >
          <i className="bi bi-geo-alt-fill text-danger"></i>
          <span className="font-monospace" style={{ fontSize: '0.85rem' }}>
            {location
              ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
              : error || 'Sin ubicación'}
          </span>
          <button
            className="btn btn-link p-0 ms-1 text-decoration-none d-flex align-items-center link-transform"
            onClick={handleGeoClick}
            title="Actualizar ubicación"
            style={{ color: 'inherit' }}
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>

        {/* Botón de Geolocalización (Mobile) */}
        <button
          className={`btn d-inline-block d-sm-none rounded-circle p-0 d-flex align-items-center justify-content-center ${
            theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'
          }`}
          onClick={handleGeoClick}
          style={{ width: '38px', height: '38px' }}
          title="Solicitar ubicación"
        >
          <i className="bi bi-crosshair"></i>
        </button>

        {/* Selector de Tema (Botón Icono Moderno) */}
        <button
          className={`btn rounded-circle p-0 d-flex align-items-center justify-content-center ${
            theme === 'dark' ? 'btn-outline-warning text-warning' : 'btn-outline-secondary'
          }`}
          onClick={toggleTheme}
          style={{ width: '38px', height: '38px', transition: 'all 0.2s' }}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          <i className={theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'}></i>
        </button>

        
        <div className="vr opacity-25 d-none d-sm-block" style={{ height: '24px' }}></div>

        {/* Botón Cerrar Sesión */}
        <button
          className="btn btn-danger px-3 py-1.5 rounded-pill fw-medium d-flex align-items-center gap-1 shadow-sm"
          onClick={logout}
          style={{
            fontSize: '0.9rem',
            letterSpacing: '0.3px',
            transition: 'all 0.2s ease'
          }}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span className="d-none d-md-inline">Cerrar sesión</span>
        </button>

      </div>
    </div>
  </nav>
  );
}

export default Navbar;
