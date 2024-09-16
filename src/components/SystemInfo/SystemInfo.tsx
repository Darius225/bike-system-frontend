import React from 'react';
import './SystemInfo.css'
import { Station } from '@custom-types/station.type';

interface SystemInfoProps {
  selectedLocation: string;
  handleLocationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  locations: { name: string }[];
  stations: Station[];
  loadingSystemInfo: boolean;
  centerLocation: { name: string };
}

const SystemInfo: React.FC<SystemInfoProps> = ({ selectedLocation, handleLocationChange, locations, stations, loadingSystemInfo, centerLocation }) => {
  return (
    <div className="system-info-container">
      <label htmlFor="location-select" className="system-info-label">Select Location:</label>
      <select
        id="location-select"
        value={selectedLocation}
        onChange={handleLocationChange}
        className="system-info-select"
      >
        {locations.map(location => (
          <option key={location.name} value={location.name.toLowerCase()}>
            {location.name}
          </option>
        ))}
      </select>

      <div className="system-info-card">
        <h3 className="system-info-title">System Information</h3>
        <div className="system-info-text">
          {loadingSystemInfo ? (
            <p className="system-info-loading">System Information is loading...</p>
          ) : (
            <>
              <p><strong>Location:</strong> {centerLocation.name}</p>
              <p><strong>Number of Stations:</strong> {stations?.length}</p>
              {stations?.length > 0 && (
                <p><strong>Total Capacity:</strong> {stations?.reduce((sum, station) => sum + (station.capacity || 0), 0)}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
