import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StationDetails from '@components/StationDetails/StationDetails';
import { getStationStatus } from '@services/api';

// Mock the getStationStatus function
vi.mock('@services/api', () => ({
  getStationStatus: vi.fn(),
}));

describe('StationDetails Component', () => {
  it('renders without crashing', async () => {
    // Mock the API response
    (getStationStatus as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        station_id: '1',
        station_name: 'Station 1',
        num_bikes_available: 5,
        num_docks_available: 10,
      },
    });
    render(<StationDetails stationId="1" location="oslo" />);
    // Wait for the details to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Station ID/i)).toBeInTheDocument();
      expect(screen.getByText(/Available Bikes/i)).toBeInTheDocument();
      expect(screen.getByText(/Available Docks/i)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching data', () => {
    // Mock the API response to simulate loading
    (getStationStatus as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => setTimeout(() => {}, 500)) // Simulate long loading
    );

    render(<StationDetails stationId="1" location="oslo" />);

    // Verify loading state is displayed
    expect(screen.getByText(/Station details are loading.../i)).toBeInTheDocument();
  });

  it('displays station details when data is fetched successfully', async () => {
    // Mock the API response
    (getStationStatus as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        station_id: '1',
        station_name: 'Station 1',
        num_bikes_available: 5,
        num_docks_available: 10,
      },
    });

    render(<StationDetails stationId="1" location="oslo" />);

    // Wait for the details to be rendered
    await waitFor(() => {
      // Check the station name
      expect(screen.getByRole('heading', { name: /Station 1/i })).toBeInTheDocument();
      
      // Check the station ID
      expect(screen.getByText(/Station ID:/i)).toBeInTheDocument();
      
      // Check available bikes
      expect(screen.getByText(/Available Bikes:/i)).toBeInTheDocument();
      
      // Check available docks
      expect(screen.getByText(/Available Docks:/i)).toBeInTheDocument();
    });
  });

  it('displays an error message when fetching data fails', async () => {
    // Mock the API response to simulate an error
    (getStationStatus as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed to fetch station details'));

    render(<StationDetails stationId="1" location="oslo" />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch station details/i)).toBeInTheDocument();
    });
  });
});
