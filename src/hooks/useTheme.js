import { useState, useEffect, useCallback } from 'react';

// Hook personalizado para administrar el tema visual de la aplicacion.
// Usa el atributo data-bs-theme para integrarse con el sistema de temas de Bootstrap.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return sessionStorage.getItem('garage_pref_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    // Actualiza el tema aplicado al documento completo.
    document.documentElement.setAttribute('data-bs-theme', theme);
    try {
      // Guarda la preferencia durante la sesion actual del navegador.
      sessionStorage.setItem('garage_pref_theme', theme);
    } catch {
      // Ignora errores de almacenamiento para no interrumpir la interfaz.
    }
  }, [theme]);

  // Alterna entre modo claro y modo oscuro.
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return { theme, toggleTheme };
}
