import React, { useEffect, useState } from 'react';
import { getStationStatus } from '@services/api';
import './StationDetails.css'; // Import the CSS file

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
  const [loadingStationDetail, setLoadingStationDetail] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stationId) {
      setLoadingStationDetail(true);
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
          setLoadingStationDetail(false);
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
    <div className="station-detail-container"> {/* Apply the CSS class */}
      <h2 className="station-detail-title">{stationStatus.station_name}</h2> {/* Apply the CSS class */}
      <p className="station-detail-item">
        <strong>Station ID:</strong> {stationStatus.station_id}
      </p>
      <p className="station-detail-item">
        <strong>Available Bikes:</strong> {stationStatus.num_bikes_available}
      </p>
      <p className="station-detail-item">
        <strong>Available Docks:</strong> {stationStatus.num_docks_available}
      </p>
    </div>
  );
};

export default StationDetails;
