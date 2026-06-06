import { useState, useCallback } from 'react';

// Hook personalizado para solicitar y almacenar la ubicacion actual del usuario.
// Centraliza el manejo de permisos, coordenadas y mensajes de error.
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // Solicita la ubicacion al navegador mediante la Geolocation API.
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('La geolocalización no está soportada por este navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setError(null);
      },
      (err) => {
        // Traduce los codigos de error del navegador a mensajes comprensibles para el usuario.
        let message = 'Permiso denegado';
        if (err.code === err.POSITION_UNAVAILABLE) {
          message = 'Posición no disponible';
        } else if (err.code === err.TIMEOUT) {
          message = 'Tiempo de espera agotado';
        }
        setError(message);
        setLocation(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 60000
      }
    );
  }, []);

  return { location, error, requestLocation };
}
