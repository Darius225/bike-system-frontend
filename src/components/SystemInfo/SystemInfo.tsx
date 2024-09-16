import React, { useEffect, useState } from 'react';
import './SystemInfo.css';
import { Station } from '@custom-types/station.type'; // Adjust the import path as needed
import _ from 'lodash';
import { getSystemInformation } from '@services/api';
import { SystemInformation } from '@custom-types/system-information.type';

interface SystemInfoProps {
  stations: Station[];
  selectedLocation: string;
  handleLocationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  locations: { name: string }[];
}

const SystemInfo: React.FC<SystemInfoProps> = ({
  stations,
  selectedLocation,
  handleLocationChange,
  locations
}) => {
  const [systemInfoResponse, setSystemInfoResponse ]= useState<SystemInformation>();
  const [loadingSystemInfo, setLoadingSystemInfo] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedLocation) return; // Skip if no location is selected

    const fetchSystemInfo = async () => {
      setLoadingSystemInfo(true);
      setError(null);

      try {
         const systemResponse = await getSystemInformation(selectedLocation);
         setSystemInfoResponse(systemResponse.data as SystemInformation);

      } catch {
        setError('Failed to load system information');
      } finally {
        setLoadingSystemInfo(false);
      }
    };

    fetchSystemInfo();
  }, [selectedLocation]);

  const totalCapacity = stations.reduce((sum, station) => sum + (station.capacity || 0), 0);
  console.log("Here loading ", loadingSystemInfo);
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
          ) : error ? (
            <p className="system-info-error">{error}</p>
          ) : (
            <>
              <p><strong>System Id:</strong> {systemInfoResponse?.system_id}</p>
              <p><strong>System name:</strong> {systemInfoResponse?.name}</p>
              <p><strong>Location:</strong> {_.capitalize(selectedLocation)}</p>
              <p><strong>Number of Stations:</strong> {stations.length}</p>
              {stations.length > 0 && (
                <p><strong>Total Capacity:</strong> {totalCapacity.toLocaleString()}</p>
              )}
              {stations.length === 0 && (
                <p><strong>Total Capacity:</strong> No stations available</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
