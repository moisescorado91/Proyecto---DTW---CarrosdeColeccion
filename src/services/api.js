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

// Obtiene nombres de paises para alimentar sugerencias del formulario.
// Usa CountriesNow API (countriesnow.space) que tiene CORS habilitado correctamente
// y no genera errores de redirect como restcountries.com en produccion.
export async function fetchCountries() {
  try {
    const response = await fetch(
      'https://countriesnow.space/api/v0.1/countries/positions'
    );
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const json = await response.json();

    // CountriesNow devuelve { error: false, data: [{ name, iso2, lat, long }] }
    const data = json.data || [];
    const countryNames = data
      .map(c => c.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'es'));

    return countryNames;
  } catch (error) {
    console.warn('No se pudieron cargar los países (CountriesNow):', error);
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
