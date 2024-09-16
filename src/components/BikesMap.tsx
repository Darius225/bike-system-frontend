// Import necessary types
import React, { useEffect, useState, ChangeEvent } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { getStations } from '../services/api';
import 'leaflet/dist/leaflet.css';
import StationDetail from './StationDetails/StationDetails';
import SystemInfo from './SystemInfo/SystemInfo';
import {Station} from "@custom-types/station.type";

// Define a smaller Leaflet default icon
const tinyIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -20],
});

const locations = [
  { name: 'Oslo', lat: 59.9139, lng: 10.7522 },
  { name: 'Milan', lat: 45.4642, lng: 9.1900 },
  { name: 'Bergen', lat: 60.3929, lng: 5.3242 },
];

const BikesMap: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('oslo');
  const [loadingSystemInfo, setLoadingSystemInfo] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stations when location changes
  useEffect(() => {
    setLoadingSystemInfo(true);
    getStations(selectedLocation)
      .then(response => {
        console.log("Fetched Stations Data:", response.data);
        setStations(response.data);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching stations:", err);
        setError('Failed to fetch stations');
      })
      .finally(() => {
        setLoadingSystemInfo(false);
      });
  }, [selectedLocation]);

  // Map component to handle map view changes
  const MapViewUpdater: React.FC<{ center: LatLngExpression }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, 13);
    }, [center, map]);
    return null;
  };

  const centerLocation = locations.find(loc => loc.name.toLowerCase() === selectedLocation);

  if (!centerLocation) {
    return <div>Location not found</div>;
  }

  // Event handler with explicit type
  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', padding: '1rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f4f8' }}>
       <SystemInfo
        selectedLocation={selectedLocation}
        handleLocationChange={handleLocationChange}
        locations={locations}
        stations={stations}
      />
      {loadingSystemInfo && <div style={{ textAlign: 'center' }}>Loading...</div>}
      {error && <div style={{ color: '#d9534f', textAlign: 'center' }}>{error}</div>}

      <MapContainer
        center={[centerLocation.lat, centerLocation.lng] as LatLngExpression}
        zoom={13}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapViewUpdater center={[centerLocation.lat, centerLocation.lng] as LatLngExpression} />
        {stations?.map(station => (
          <Marker
            key={station.station_id}
            position={[station.lat, station.lon] as LatLngExpression}
            icon={tinyIcon}
          >
            <Popup>
              <div>
                <strong>{station.name}</strong><br />
                {station.is_virtual_station ? 'Virtual Station' : 'Real Station'}<br />
                <strong>Capacity:</strong> {station.capacity}<br />
                <div style={{ marginTop: '10px' }}>
                  <React.Suspense fallback={<p>Station details are loading...</p>}>
                    <StationDetail stationId={station.station_id} location={selectedLocation} />
                  </React.Suspense>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BikesMap;
