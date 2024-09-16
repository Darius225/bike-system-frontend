import React, { useEffect, useState } from 'react';
import { getStationStatus } from '../../services/api';

interface StationDetailProps {
  stationId: string | null;
  location: string;
}

const StationDetails: React.FC<StationDetailProps> = ({ stationId, location }) => {
  const [stationStatus, setStationStatus] = useState<{
    station_id: string;
    station_name: string;
    num_bikes_available: number;
    num_docks_available: number;
  } | null>(null);
  const [loadingStationDetail, setLoadingStationDetail] = useState<boolean>(false); // Updated variable name
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stationId) {
      setLoadingStationDetail(true); // Start loading station details
      getStationStatus(location, stationId)
        .then(response => {
          setStationStatus(response.data); // Adjust based on your API response
          setError(null);
        })
        .catch(err => {
          console.error("Error fetching station details:", err);
          setError('Failed to fetch station details');
        })
        .finally(() => {
          setLoadingStationDetail(false); // Stop loading station details
        });
    }
  }, [stationId, location]);

  if (loadingStationDetail) {
    return <div>Station details are loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!stationStatus) {
    return <div>Select a station to see details</div>;
  }

  return (
    <div style={{
      padding: '20px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      margin: 'auto',
    }}>
      <h2 style={{ marginTop: 0 }}>{stationStatus.station_name}</h2>
      <p><strong>Station ID:</strong> {stationStatus.station_id}</p>
      <p><strong>Available Bikes:</strong> {stationStatus.num_bikes_available}</p>
      <p><strong>Available Docks:</strong> {stationStatus.num_docks_available}</p>
    </div>
  );
};

export default StationDetails;
