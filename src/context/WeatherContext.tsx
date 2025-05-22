'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { weatherMap, getLocationFromLatLon } from '@/utils/locationUtils';

interface WeatherContextType {
    temperature: number | null;
    temperatureC: string | null;
    loading: boolean;
    error: string | null;
    iconUrl: string | React.ReactNode | null;
    condition: string;
    windSpeed: number | null;
    feelsLike: number | null;
    precipChance: number | null;
    uvIndex: number | null;
    humidity: number | null;
    dewPoint: number | null;
    visibility: number | null;
    pressure: number | null;
    sunrise: string | null;
    sunset: string | null;
    latitude: number | null;
    longitude: number | null;
    city: string;
    state: string;
    zip: string;
    locError: string;
    displayLocation: string;
    isFetchingLocation: boolean;
    usedMyLocation: boolean;
    showLocationForm: boolean;
    lastUpdated: string | null;
    setLatitude: (lat: number) => void;
    setLongitude: (lon: number) => void;
    setCity: (city: string) => void;
    setState: (state: string) => void;
    setZip: (zip: string) => void;
    setLocError: (error: string) => void;
    setShowLocationForm: (show: boolean) => void;
    setIsFetchingLocation: (fetching: boolean) => void;
    setUsedMyLocation: (used: boolean) => void;
    refreshWeatherData: () => void;
}

export const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function useWeather() {
    const ctx = useContext(WeatherContext);
    if (!ctx) throw new Error('useWeather must be used within a WeatherProvider');
    return ctx;
}

export function WeatherProvider({ children }: { children: ReactNode }) {
    const [temperature, setTemperature] = useState<number | null>(null);
    const [temperatureC, setTemperatureC] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [iconUrl, setIconUrl] = useState<string | React.ReactNode | null>(null);
    const [condition, setCondition] = useState('');
    const [windSpeed, setWindSpeed] = useState<number | null>(null);
    const [feelsLike, setFeelsLike] = useState<number | null>(null);
    const [precipChance, setPrecipChance] = useState<number | null>(null);
    const [uvIndex, setUvIndex] = useState<number | null>(null);
    const [humidity, setHumidity] = useState<number | null>(null);
    const [dewPoint, setDewPoint] = useState<number | null>(null);
    const [visibility, setVisibility] = useState<number | null>(null);
    const [pressure, setPressure] = useState<number | null>(null);
    const [sunrise, setSunrise] = useState<string | null>(null);
    const [sunset, setSunset] = useState<string | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [locError, setLocError] = useState('');
    const [displayLocation, setDisplayLocation] = useState('Select a location');
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [usedMyLocation, setUsedMyLocation] = useState(false);
    const [showLocationForm, setShowLocationForm] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Effect to save location to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined' && latitude !== null && longitude !== null) {
            const locationData = {
                latitude,
                longitude,
                city,
                state,
                zip,
                usedMyLocation,
            };
            localStorage.setItem('weatherLocation', JSON.stringify(locationData));
        }
    }, [latitude, longitude, city, state, zip, usedMyLocation]);

    // Effect to update location details when coordinates change
    useEffect(() => {
        if (usedMyLocation && latitude !== null && longitude !== null) {
            getLocationFromLatLon(latitude, longitude)
                .then((details) => {
                    setCity(details.city);
                    setState(details.state);
                    setZip(details.zip);
                })
                .catch((err) => {
                    console.error('Failed to get location details:', err);
                    setLocError('Could not determine your location. Please enter it manually.');
                    setShowLocationForm(true);
                });
        }
    }, [latitude, longitude, usedMyLocation]);

    // Effect to update display location when location details change
    useEffect(() => {
        if (city && state) {
            setDisplayLocation(`${city}, ${state}`);
        } else if (usedMyLocation) {
            setDisplayLocation('Loading location...');
        } else if (latitude === null || longitude === null) {
            setDisplayLocation('Select a location');
        } else {
            setDisplayLocation('Loading location details...');
        }
    }, [city, state, usedMyLocation, latitude, longitude]);

    // Effect to initialize location on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLocation = localStorage.getItem('weatherLocation');
            if (savedLocation) {
                const {
                    latitude,
                    longitude,
                    city,
                    state,
                    zip,
                    usedMyLocation: savedUsedMyLocation,
                } = JSON.parse(savedLocation);
                setLatitude(latitude);
                setLongitude(longitude);
                setCity(city || '');
                setState(state || '');
                setZip(zip || '');
                setUsedMyLocation(savedUsedMyLocation || false);
            } else if (navigator.geolocation) {
                setIsFetchingLocation(true);
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setLatitude(pos.coords.latitude);
                        setLongitude(pos.coords.longitude);
                        setUsedMyLocation(true);
                        setIsFetchingLocation(false);

                        const locationData = {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                            city: '',
                            state: '',
                            zip: '',
                            usedMyLocation: true,
                        };
                        localStorage.setItem('weatherLocation', JSON.stringify(locationData));
                    },
                    () => {
                        setLocError('Could not get your location');
                        setIsFetchingLocation(false);
                        setShowLocationForm(true);
                    }
                );
            }
        }
    }, []);

    // Effect to load saved location from localStorage on app start
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLocation = localStorage.getItem('weatherLocation');
            if (savedLocation) {
                try {
                    const {
                        latitude: savedLat,
                        longitude: savedLon,
                        city: savedCity,
                        state: savedState,
                        zip: savedZip,
                        usedMyLocation: savedUsedMyLocation,
                    } = JSON.parse(savedLocation);

                    // Only update location if we actually have coordinates
                    if (savedLat && savedLon) {
                        setLatitude(savedLat);
                        setLongitude(savedLon);
                        if (savedUsedMyLocation) {
                            setUsedMyLocation(true);
                            // When using geolocation, we clear the form fields
                            setCity('');
                            setState('');
                            setZip('');
                        } else {
                            // When using manual location, restore the form fields
                            setCity(savedCity || '');
                            setState(savedState || '');
                            setZip(savedZip || '');
                        }
                        setShowLocationForm(false); // Close the form after restoring location
                    }
                } catch (err) {
                    console.error('Failed to parse saved location:', err);
                }
            }
        }
    }, []);

    // Effect to fetch weather data when location changes
    useEffect(() => {
        fetchWeatherData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latitude, longitude]);

    function fetchWeatherData() {
        if (latitude === null || longitude === null) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability,uv_index,relative_humidity_2m,dew_point_2m,visibility,surface_pressure&daily=sunrise,sunset&temperature_unit=fahrenheit&timezone=America%2FChicago`;
        console.log('Fetching weather data:', { url, latitude, longitude });
        fetch(url)
            .then((response) => {
                console.log('Weather API response status:', response.status);
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => {
                const tempF = data.current?.temperature_2m;
                setTemperature(tempF);
                if (typeof tempF === 'number') {
                    setTemperatureC((((tempF - 32) * 5) / 9).toFixed(1));
                } else {
                    setTemperatureC(null);
                }
                setWindSpeed(data.current?.wind_speed_10m ?? null);
                setFeelsLike(data.current?.apparent_temperature ?? null);
                setPrecipChance(data.current?.precipitation_probability ?? null);
                setUvIndex(data.current?.uv_index ?? null);
                setHumidity(data.current?.relative_humidity_2m ?? null);
                setDewPoint(data.current?.dew_point_2m ?? null);
                setVisibility(data.current?.visibility ?? null);
                setPressure(data.current?.surface_pressure ?? null);
                // Extract today's sunrise/sunset from daily arrays
                if (data.daily?.sunrise && data.daily.sunrise.length > 0) {
                    setSunrise(data.daily.sunrise[0]);
                } else {
                    setSunrise(null);
                }
                if (data.daily?.sunset && data.daily.sunset.length > 0) {
                    setSunset(data.daily.sunset[0]);
                } else {
                    setSunset(null);
                }
                const weatherCode = data.current?.weather_code;
                const weather = weatherMap[weatherCode] || { icon: '❓', text: 'Unknown' };
                setIconUrl(weather.icon);
                setCondition(weather.text);
                setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }

    function refreshWeatherData() {
        fetchWeatherData();
    }

    return (
        <WeatherContext.Provider
            value={{
                temperature,
                temperatureC,
                loading,
                error,
                iconUrl,
                condition,
                windSpeed,
                feelsLike,
                precipChance,
                uvIndex,
                humidity,
                dewPoint,
                visibility,
                pressure,
                sunrise,
                sunset,
                latitude,
                longitude,
                city,
                state,
                zip,
                locError,
                displayLocation,
                isFetchingLocation,
                usedMyLocation,
                showLocationForm,
                lastUpdated,
                setLatitude,
                setLongitude,
                setCity,
                setState,
                setZip,
                setLocError,
                setIsFetchingLocation,
                setUsedMyLocation,
                setShowLocationForm,
                refreshWeatherData,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
}
