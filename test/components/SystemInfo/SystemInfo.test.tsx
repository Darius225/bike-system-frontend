import { render, screen,  waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { getSystemInformation } from '@services/api';
import { SystemInformation } from '@custom-types/system-information.type';
import SystemInfo from '@components/SystemInfo/SystemInfo';

// Mock the getSystemInformation function
vi.mock('@services/api', () => ({
  getSystemInformation: vi.fn(),
}));

describe('SystemInfo Component', () => {
  it('renders without crashing', () => {
    render(<SystemInfo 
      stations={[]}
      selectedLocation=""
      handleLocationChange={vi.fn()}
      locations={[{ name: 'New York' }]}
    />);
    expect(screen.getByLabelText(/Select Location:/i)).toBeInTheDocument();
  });

  it('displays loading state while fetching system information', async () => {
    // Mock the API response to simulate loading
    (getSystemInformation as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => setTimeout(() => {}, 500)) // Simulate long loading
    );

    render(<SystemInfo 
      stations={[]}
      selectedLocation="milan"
      handleLocationChange={vi.fn()}
      locations={[{ name: 'Milan' }]}
    />);

    // Verify loading state is displayed
    expect(screen.getByText(/System Information is loading.../i)).toBeInTheDocument();
  });

  it('displays an error message if fetching system information fails', async () => {
    // Mock the API response to simulate an error
    (getSystemInformation as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed to load system information'));

    render(<SystemInfo 
      stations={[]}
      selectedLocation="milan"
      handleLocationChange={vi.fn()}
      locations={[{ name: 'Milan' }]}
    />);

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText(/Failed to load system information/i)).toBeInTheDocument());
  });

  it('displays no stations message if there are no stations', async () => {
    (getSystemInformation as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: {
          system_id: 'milan',
          email: 'info@milanbikes.com',
          operator: 'Milan Bike Share',
          timezone: 'Europe/Rome',
          phone_number: '+39 123 456 789',
          name: 'Milan Bike System',
        } as SystemInformation,
      });
  
      render(<SystemInfo 
        stations={[]} // Empty array for stations
        selectedLocation="milan"
        handleLocationChange={vi.fn()}
        locations={[{ name: 'Milan' }]}
      />);
  
      // Wait for the component to update and render the correct message
      await waitFor(() => {
        expect(screen.getByText(/Total Capacity:/i)).toBeInTheDocument();
        expect(screen.getByText('No stations available')).toBeInTheDocument();
      });
  });
});
