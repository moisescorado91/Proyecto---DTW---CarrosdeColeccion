// Servicio de integracion con APIs publicas externas utilizadas por la aplicacion.
// Cada funcion maneja errores para evitar que una falla de red bloquee la interfaz.

// Obtiene una lista de marcas de automoviles desde la API publica de NHTSA.
export async function fetchCarMakes() {
  try {
    const response = await fetch(
      'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
    );
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    return (data.Results || [])
      .map(m => (m.MakeName || '').toLowerCase())
      .filter(Boolean)
      .sort()
      .slice(0, 250)
      .map(name => name.replace(/\b\w/g, l => l.toUpperCase()));
  } catch (error) {
    console.warn('No se pudieron cargar las marcas (NHTSA):', error);
    return [];
  }
}
