import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useCarContext } from '../context/CarContext';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapMarkers({ cars, countryCoords }) {
  const map = useMap();

  useEffect(() => {
    
    if (cars.length > 0) {
      const bounds = [];
      cars.forEach(car => {
        const coords = countryCoords[car.pais?.toLowerCase()];
        if (coords) {
          bounds.push(coords);
        }
      });
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
      }
    }
  }, [cars, countryCoords, map]);

  // se agrupan automoviles por coordenadas para evitar marcadores duplicados en el mismo pais
  const groupedMarkers = cars.reduce((acc, car) => {
    const coords = countryCoords[car.pais?.toLowerCase()];
    if (!coords) return acc;
    
    const key = coords.join(',');
    if (!acc[key]) {
      acc[key] = {
        coords,
        cars: [],
        pais: car.pais
      };
    }
    acc[key].cars.push(car);
    return acc;
  }, {});

  return (
    <>
      {Object.values(groupedMarkers).map((group, index) => (
        <Marker key={`marker-${index}`} position={group.coords}>
          <Popup>
            <div>
              <h6><i className="bi bi-geo-alt-fill"></i> {group.pais}</h6>
              <div className="small text-muted mb-1">
                {group.cars.length} automóvil(es)
              </div>
              <ul className="mb-0">
                {group.cars.map(car => (
                  <li key={car.id}>
                    {car.marca} {car.modelo} ({car.anio})
                  </li>
                ))}
              </ul>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}


function MapView() {
  const { state } = useCarContext();
  const { cars } = state;
  const [countryCoords, setCountryCoords] = useState({});
  const [mapStatus, setMapStatus] = useState('Inicializando mapa...');
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    loadCountryCoordinates();
  }, []);

  useEffect(() => {
    setMapStatus(`Listo · ${cars.length} auto(s)`);
    setMapKey(prev => prev + 1);
  }, [cars]);

  // Usa CountriesNow API para obtener coordenadas de paises.
  // Esta API tiene CORS habilitado correctamente y no genera errores de redirect
  // como restcountries.com al estar desplegado en Netlify u otros hostings.
  const loadCountryCoordinates = async () => {
    try {
      const response = await fetch(
        'https://countriesnow.space/api/v0.1/countries/positions'
      );
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const json = await response.json();

      // CountriesNow devuelve { error: false, data: [{ name, iso2, lat, long }] }
      const data = json.data || [];
      const coords = {};
      data.forEach(country => {
        const name = country.name;
        const lat  = country.lat;
        const lng  = country.long;

        if (!name || lat == null || lng == null) return;

        // se indexa por nombre en minusculas para coincidir con lo que escribe el usuario.
        coords[name.toLowerCase()] = [lat, lng];
      });
      
      setCountryCoords(coords);
      setMapStatus(`Listo · ${cars.length} auto(s)`);
    } catch (error) {
      // mostramos mensajes de errores
      console.warn('No se pudieron cargar los países:', error);
      setMapStatus('No se pudieron cargar coordenadas de países');
    }
  };

  return (
    <div className="row g-3 mt-1 mb-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span><i className="bi bi-map"></i> Mapa de ubicaciones por país</span>
            <small className="text-muted">{mapStatus}</small>
          </div>
          <div className="card-body p-0">
            <div style={{ height: '400px' }}>
              <MapContainer 
                key={mapKey}
                center={[13.7, -88.9]} 
                zoom={2} 
                style={{ height: '100%', width: '100%' }}
                worldCopyJump={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  maxZoom={18}
                />
                <MapMarkers cars={cars} countryCoords={countryCoords} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;
