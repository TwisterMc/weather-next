import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherCard from './WeatherCard';
import { WeatherContext } from '@/context/WeatherContext';

const requiredProps = {
    title: 'Today',
    unitSymbol: '°F',
    windLabel: 'Wind',
    windUnit: 'mph',
    precipitationLabel: 'Precipitation',
};

const mockWeatherContext = {
    temperature: 72,
    temperatureC: '22.2',
    loading: false,
    error: null,
    iconUrl: '☀️',
    condition: 'Sunny',
    windSpeed: 10,
    feelsLike: 70,
    precipChance: 5,
    latitude: 0,
    longitude: 0,
    city: '',
    state: '',
    zip: '',
    locError: '',
    displayLocation: '',
    isFetchingLocation: false,
    usedMyLocation: false,
    showLocationForm: false,
    lastUpdated: '',
    setLatitude: jest.fn(),
    setLongitude: jest.fn(),
    setCity: jest.fn(),
    setState: jest.fn(),
    setZip: jest.fn(),
    setLocError: jest.fn(),
    setShowLocationForm: jest.fn(),
    setIsFetchingLocation: jest.fn(),
    setUsedMyLocation: jest.fn(),
    refreshWeatherData: jest.fn(),
    uvIndex: 0,
    sunrise: '',
    sunset: '',
    humidity: null,
    dewPoint: null,
    visibility: null,
    pressure: null,
    weatherCode: 0,
};

function renderWithMockContext(ui: React.ReactElement) {
    return render(
        <WeatherContext.Provider value={{ ...mockWeatherContext, weatherCode: 0 }}>{ui}</WeatherContext.Provider>
    );
}

describe('WeatherCard', () => {
    it('renders title and labels', () => {
        renderWithMockContext(<WeatherCard {...requiredProps} />);
        expect(screen.getByText('Today')).toBeInTheDocument();
        expect(screen.getByText('Wind:')).toBeInTheDocument();
        expect(screen.getByText('Precipitation:')).toBeInTheDocument();
    });

    it('shows loading animation when loading', () => {
        renderWithMockContext(<WeatherCard {...requiredProps} isFetchingLocation={true} />);
        expect(screen.getByText('Fetching location...')).toBeInTheDocument();
        expect(screen.getAllByTestId('weather-card-dot').length).toBe(3);
    });

    it('updates on page title when location changes', () => {
        const newLocation = 'Los Angeles, CA';
        // Render a wrapper with an .app-title element and WeatherCard
        render(
            <div>
                <h1 className="app-title">{newLocation}</h1>
                <WeatherContext.Provider
                    value={{
                        ...mockWeatherContext,
                        displayLocation: newLocation,
                        uvIndex: 0,
                        sunrise: '',
                        sunset: '',
                        weatherCode: 0,
                    }}
                >
                    <WeatherCard {...requiredProps} />
                </WeatherContext.Provider>
            </div>
        );
        expect(document.querySelector('.app-title')?.textContent).toBe(newLocation);
    });

    it('renders with zip code context', () => {
        const contextWithZip = {
            ...mockWeatherContext,
            zip: '12345',
            temperature: 60,
            temperatureC: '15.6',
            condition: 'Cloudy',
            iconUrl: '☁️',
            windSpeed: 5,
            feelsLike: 58,
            precipChance: 20,
            uvIndex: 5,
            sunrise: '06:00',
            sunset: '18:00',
            humidity: null,
            dewPoint: null,
            visibility: null,
            pressure: null,
            weatherCode: 3,
        };

        render(
            <WeatherContext.Provider value={contextWithZip}>
                <WeatherCard {...requiredProps} />
            </WeatherContext.Provider>
        );
        expect(screen.getByText('60°F')).toBeInTheDocument();
        expect(screen.getByText('Cloudy')).toBeInTheDocument();
    });

    it('shows N/A for feels like, wind, and precipitation when values are null', () => {
        const contextWithNulls = {
            ...mockWeatherContext,
            feelsLike: null,
            windSpeed: null,
            precipChance: null,
            humidity: null,
            dewPoint: null,
            visibility: null,
            pressure: null,
            weatherCode: 0,
        };
        render(
            <WeatherContext.Provider value={contextWithNulls}>
                <WeatherCard {...requiredProps} />
            </WeatherContext.Provider>
        );
        expect(screen.getAllByText('N/A').length).toBeGreaterThanOrEqual(3);
    });
});
