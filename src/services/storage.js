const STORAGE_KEY = 'garage_cars_v1';

// Lee la coleccion guardada en localStorage y devuelve un arreglo seguro.
// Si no existen datos o el contenido esta corrupto, retorna una lista vacia.
export function loadCars() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const cars = raw ? JSON.parse(raw) : [];
    return Array.isArray(cars) ? cars : [];
  } catch (error) {
    console.error('Error loading cars from localStorage:', error);
    return [];
  }
}

// Guarda la coleccion completa en localStorage.
// Tambien controla errores de cuota, especialmente importantes cuando se almacenan imagenes.
export function saveCars(cars) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  } catch (error) {
    console.error('Error saving cars to localStorage:', error);
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      throw new Error('Cuota de almacenamiento excedida. Considera quitar imágenes de algunos autos.');
    }
    throw new Error('No se pudo guardar en almacenamiento local');
  }
}
