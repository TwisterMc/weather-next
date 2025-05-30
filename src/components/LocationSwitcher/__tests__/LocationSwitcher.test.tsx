import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationSwitcher from '../LocationSwitcher';
import { useWeather } from '@/context/WeatherContext';
import { getLatLonFromLocation, getLocationFromLatLon, getLocationFromZip } from '@/utils/locationUtils';

// Mock the WeatherContext
jest.mock('@/context/WeatherContext', () => ({
    useWeather: jest.fn(),
}));

// Mock location utils
jest.mock('@/utils/locationUtils', () => ({
    getLatLonFromLocation: jest.fn(),
    getLocationFromLatLon: jest.fn(),
    getLocationFromZip: jest.fn(),
}));

describe('LocationSwitcher', () => {
    const mockSetLocError = jest.fn();
    const mockSetIsFetchingLocation = jest.fn();
    const mockSetUsedMyLocation = jest.fn();
    const mockSetLatitude = jest.fn();
    const mockSetLongitude = jest.fn();
    const mockSetCity = jest.fn();
    const mockSetState = jest.fn();
    const mockSetZip = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useWeather as jest.Mock).mockReturnValue({
            locError: '',
            setLocError: mockSetLocError,
            setIsFetchingLocation: mockSetIsFetchingLocation,
            setUsedMyLocation: mockSetUsedMyLocation,
            setLatitude: mockSetLatitude,
            setLongitude: mockSetLongitude,
            setCity: mockSetCity,
            setState: mockSetState,
            setZip: mockSetZip,
        });

        // Mock successful location utils responses
        (getLatLonFromLocation as jest.Mock).mockResolvedValue({ lat: 45.5, lon: -122.6 });
        (getLocationFromLatLon as jest.Mock).mockResolvedValue({
            city: 'Portland',
            state: 'OR',
            zip: '97201',
        });
        (getLocationFromZip as jest.Mock).mockResolvedValue({
            city: 'Portland',
            state: 'OR',
        });
    });

    it('renders when show is true', () => {
        render(<LocationSwitcher show={true} onClose={mockOnClose} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Change Location')).toBeInTheDocument();
    });

    it('does not render when show is false', () => {
        render(<LocationSwitcher show={false} onClose={mockOnClose} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('handles ZIP code search correctly', async () => {
        render(<LocationSwitcher show={true} onClose={mockOnClose} />);

        const input = screen.getByLabelText('Enter ZIP code or city name');
        fireEvent.change(input, { target: { value: '97201' } });

        const submitButton = screen.getByRole('button', { name: 'Update Location' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSetZip).toHaveBeenCalledWith('97201');
            expect(mockSetCity).toHaveBeenCalledWith('Portland');
            expect(mockSetState).toHaveBeenCalledWith('OR');
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles city, state search correctly', async () => {
        render(<LocationSwitcher show={true} onClose={mockOnClose} />);

        const input = screen.getByLabelText('Enter ZIP code or city name');
        fireEvent.change(input, { target: { value: 'Portland, OR' } });

        const submitButton = screen.getByRole('button', { name: 'Update Location' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSetCity).toHaveBeenCalledWith('Portland');
            expect(mockSetState).toHaveBeenCalledWith('OR');
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles geolocation successfully', async () => {
        const mockGeolocation = {
            getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
                success({
                    coords: {
                        latitude: 45.5,
                        longitude: -122.6,
                    },
                })
            ),
        };
        Object.defineProperty(global.navigator, 'geolocation', {
            value: mockGeolocation,
            configurable: true,
        });

        render(<LocationSwitcher show={true} onClose={mockOnClose} />);

        const useLocationButton = screen.getByRole('button', { name: 'Use My Location' });
        fireEvent.click(useLocationButton);

        await waitFor(() => {
            expect(mockSetUsedMyLocation).toHaveBeenCalledWith(true);
            expect(mockSetLatitude).toHaveBeenCalledWith(45.5);
            expect(mockSetLongitude).toHaveBeenCalledWith(-122.6);
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles geolocation error', async () => {
        const mockGeolocation = {
            getCurrentPosition: jest.fn().mockImplementationOnce((_success, error) => error()),
        };
        Object.defineProperty(global.navigator, 'geolocation', {
            value: mockGeolocation,
            configurable: true,
        });

        render(<LocationSwitcher show={true} onClose={mockOnClose} />);

        const useLocationButton = screen.getByRole('button', { name: 'Use My Location' });
        fireEvent.click(useLocationButton);

        await waitFor(() => {
            expect(mockSetLocError).toHaveBeenCalledWith('Could not get your location');
            expect(mockSetIsFetchingLocation).toHaveBeenCalledWith(false);
            expect(mockSetUsedMyLocation).toHaveBeenCalledWith(false);
        });
    });

    it('handles invalid input format', async () => {
        render(<LocationSwitcher show={true} onClose={mockOnClose} />);

        const input = screen.getByLabelText('Enter ZIP code or city name');
        fireEvent.change(input, { target: { value: '!@#$%' } });

        const submitButton = screen.getByRole('button', { name: 'Update Location' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSetLocError).toHaveBeenCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });

    it('handles API errors gracefully', async () => {
        (getLatLonFromLocation as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

        render(<LocationSwitcher show={true} onClose={mockOnClose} />);

        const input = screen.getByLabelText('Enter ZIP code or city name');
        fireEvent.change(input, { target: { value: '97201' } });

        const submitButton = screen.getByRole('button', { name: 'Update Location' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSetLocError).toHaveBeenCalledWith('API Error');
            expect(mockSetIsFetchingLocation).toHaveBeenCalledWith(false);
            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });

    it('closes on escape key press', () => {
        render(<LocationSwitcher show={true} onClose={mockOnClose} />);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes on close button click', () => {
        render(<LocationSwitcher show={true} onClose={mockOnClose} />);
        const closeButton = screen.getByRole('button', { name: 'Close location switcher' });
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
    });
});
