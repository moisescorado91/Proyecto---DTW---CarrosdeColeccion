import React, { useState, useEffect } from 'react';
import { useCarContext } from '../context/CarContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTheme } from '../hooks/useTheme';

// Barra de navegacion principal.
// Presenta la identidad del proyecto y controles globales como ubicacion y tema visual.
function Navbar() {
  const { showToast } = useCarContext();
  const { location, error, requestLocation } = useGeolocation();
  const { theme, toggleTheme } = useTheme();

  // Solicita al navegador la ubicacion del usuario al presionar el boton correspondiente.
  const handleGeoClick = () => {
    requestLocation();
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
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="#">
          <i className="bi bi-car-front-fill"></i> Garaje de Colección
        </a>
        <div className="d-flex align-items-center gap-3">
          {/* Coordenadas actuales o mensaje de estado de la geolocalizacion. */}
          <span className="text-light small d-none d-sm-inline">
            <i className="bi bi-geo-alt"></i>{' '}
            <span>
              {location 
                ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                : error || 'Sin ubicación'}
            </span>
          </span>
          <button 
            className="btn btn-outline-light btn-sm" 
            onClick={handleGeoClick}
            title="Solicitar ubicación"
          >
            <i className="bi bi-crosshair"></i>
          </button>
          {/* Interruptor para alternar entre tema claro y oscuro. */}
          <div className="form-check form-switch text-light m-0">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="themeSwitch"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <label className="form-check-label" htmlFor="themeSwitch">
              <i className="bi bi-moon-stars"></i>
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
