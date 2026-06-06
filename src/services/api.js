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

// Obtiene nombres de paises en ingles y espanol para alimentar sugerencias del formulario.
export async function fetchCountries() {
  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,translations'
    );
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();

    // Extrae nombres de paises en espanol e ingles.
    const countryNames = new Set();
    data.forEach(country => {
      // Nombre comun en ingles.
      if (country.name?.common) {
        countryNames.add(country.name.common);
      }
      // Nombre en espanol si esta disponible.
      if (country.translations?.spa?.common) {
        countryNames.add(country.translations.spa.common);
      }
    });

    return Array.from(countryNames).sort((a, b) => a.localeCompare(b, 'es'));
  } catch (error) {
    console.warn('No se pudieron cargar los países (RestCountries):', error);
    return [];
  }
}

// Consulta tasas de cambio con base USD para mostrar conversiones del valor total.
export async function fetchExchangeRates() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (data.result !== 'success') throw new Error('La API de tasas no devolvió éxito');
    return {
      rates: data.rates,
      base: data.base_code || 'USD'
    };
  } catch (error) {
    console.warn('No se pudieron cargar tasas de cambio:', error);
    throw error;
  }
}
