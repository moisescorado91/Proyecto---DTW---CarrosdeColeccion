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



function MapView() {
  const { state } = useCarContext();
  const { cars } = state;
  const [countryCoords, setCountryCoords] = useState({});
  const [mapStatus, setMapStatus] = useState('Inicializando mapa...');
  const [mapKey, setMapKey] = useState(0);


  useEffect(() => {
    setMapStatus(`Listo · ${cars.length} auto(s)`);
    setMapKey(prev => prev + 1);
  }, [cars]);


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
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;
