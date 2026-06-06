import { useState, useEffect } from 'react';

// Hook reutilizable para sincronizar un estado de React con localStorage.
// Permite conservar datos aunque la pagina se recargue.
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  useEffect(() => {
    // Cada cambio en el estado se refleja en localStorage usando la clave indicada.
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error setting localStorage key:', key, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
