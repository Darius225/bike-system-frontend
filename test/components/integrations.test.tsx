import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BikesMap from '@components/BikesMap';
import StationDetails from '@components/StationDetails/StationDetails';
import { getStations, getStationStatus } from '@services/api';

// Mock the API functions
vi.mock('@services/api', () => ({
  getStations: vi.fn(),
  getStationStatus: vi.fn(),
}));

describe('Integration Test for BikesMap and StationDetails', () => {
  it('updates StationDetails when a station is selected in BikesMap', async () => {
    // Mock the getStations response
    (getStations as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        {
          station_id: '1',
          name: 'Station 1',
          address: 'Address 1',
          cross_street: 'Cross Street 1',
          lat: 59.9139,
          lon: 10.7522,
          capacity: 10,
          is_virtual_station: false,
          numBikesAvailable: 5,
          numDocksAvailable: 10,
        },
        {
          station_id: '2',
          name: 'Station 2',
          address: 'Address 2',
          cross_street: 'Cross Street 2',
          lat: 60.0000,
          lon: 11.0000,
          capacity: 15,
          is_virtual_station: false,
          numBikesAvailable: 8,
          numDocksAvailable: 7,
        },
      ],
    });

    // Mock the getStationStatus response
    (getStationStatus as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        station_id: '1',
        station_name: 'Station 1',
        num_bikes_available: 5,
        num_docks_available: 10,
      },
    });

    render(
      <div>
        <BikesMap />
        <StationDetails stationId="1" location="milan" />
      </div>
    );

    // Wait for BikesMap to render and populate select options
    await waitFor(() => expect(screen.getByLabelText(/Select Location:/i)).toBeInTheDocument());

    // Simulate selecting a station from the dropdown
    fireEvent.change(screen.getByLabelText(/Select Location:/i), { target: { value: '1' } });

    // Wait for the StationDetails to be updated
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /Station 1/i })).toBeInTheDocument();
      expect(screen.getByText(/Station ID:/i)).toBeInTheDocument();
      expect(screen.getByText(/Available Bikes:/i)).toBeInTheDocument();
      expect(screen.getByText(/Available Docks:/i)).toBeInTheDocument();
    });
  });});
