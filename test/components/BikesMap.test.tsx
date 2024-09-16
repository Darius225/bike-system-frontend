import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BikesMap from '@components/BikesMap';
import { getStations, getSystemInformation } from '@services/api';

// Mock the API functions
vi.mock('@services/api', () => ({
  getStations: vi.fn(),
  getSystemInformation: vi.fn(),
}));

describe('BikesMap Component', () => {
  it('renders without crashing', () => {
    // Mock the API response for stations
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
        },
      ],
    });

    // Mock the API response for system info
    (getSystemInformation as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        system_id: 'milan',
        email: 'info@milanbikes.com',
        operator: 'Milan Bike Share',
        timezone: 'Europe/Rome',
        phone_number: '+39 123 456 789',
        name: 'Milan Bike System',
      },
    });

    render(<BikesMap />);
    expect(screen.getByLabelText(/Select Location:/i)).toBeInTheDocument();
  });

  it('changes location on select change and updates system info', async () => {
    // Mock the API response for stations
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
        },
      ],
    });

    // Mock the API response for system info
    (getSystemInformation as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        system_id: 'milan',
        email: 'info@milanbikes.com',
        operator: 'Milan Bike Share',
        timezone: 'Europe/Rome',
        phone_number: '+39 123 456 789',
        name: 'Milan Bike System',
      },
    });

    render(<BikesMap />);

    // Find the select element
    const selectElement = screen.getByLabelText(/Select Location:/i) as HTMLSelectElement;

    // Change the select value
    fireEvent.change(selectElement, { target: { value: 'milan' } });

    // Wait for the component to update
    await waitFor(() => expect(selectElement.value).toBe('milan'));

    // Verify that the correct system information is displayed
    expect(screen.getByText(/System Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Name:/i)).toBeInTheDocument()
    expect(screen.getByText('Milan Bike System')).toBeInTheDocument();
    expect(screen.getByText(/system id/i)).toBeInTheDocument();
  });

  it('displays an error message when fetching stations fails', async () => {
    // Mock the API response to simulate an error for stations
    (getStations as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed to fetch stations'));

    render(<BikesMap />);

    // Find the select element
    const selectElement = screen.getByLabelText(/Select Location:/i) as HTMLSelectElement;

    // Change the select value
    fireEvent.change(selectElement, { target: { value: 'milan' } });

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText(/Failed to fetch stations/i)).toBeInTheDocument());
  });

  it('displays loading state while fetching data', async () => {
    // Mock the API response to simulate loading for stations
    (getStations as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => setTimeout(() => {}, 500)) // Simulate long loading
    );

    render(<BikesMap />);

    // Find the select element
    const selectElement = screen.getByLabelText(/Select Location:/i) as HTMLSelectElement;

    // Change the select value
    fireEvent.change(selectElement, { target: { value: 'milan' } });

    // Verify loading state is displayed
    await waitFor(() => expect(screen.getByText(/System Information is loading.../i)).toBeInTheDocument());
  });

  it('when changing the location, it should delete the markers', async () => {
    // Mock the API response for stations
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
        },
      ],
    });

    render(<BikesMap />);

    // Find the select element
    const selectElement = screen.getByLabelText(/Select Location:/i) as HTMLSelectElement;

    // Change the select value
    fireEvent.change(selectElement, { target: { value: 'milan' } });

    // Wait for the map markers to be rendered
    await waitFor(() => {
      // Adjust the query to match how markers are represented in your component
      expect(screen.queryByRole('img', { name: /Marker/i })).toBeNull();
    });
  });
});
