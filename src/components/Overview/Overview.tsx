'use client';
import React, { useEffect } from 'react';
import ThreeDayForecast from '@/components/ThreeDayForecast/ThreeDayForecast';
import LocationSwitcher from '@/components/LocationSwitcher/LocationSwitcher';
import './Overview.css';
import WeatherCard from '@/components/WeatherCard/WeatherCard';
import { useWeather } from '@/context/WeatherContext';

export default function Overview() {
    const {
        temperature,
        loading,
        latitude,
        longitude,

        displayLocation,
        isFetchingLocation,
        showLocationForm,

        setShowLocationForm,
        refreshWeatherData,
    } = useWeather();

    useEffect(() => {
        refreshWeatherData();
        // eslint-disable-next-line
    }, [latitude, longitude]);

    function getBackgroundGradient(temp: number | null) {
        if (temp === null || isNaN(temp)) {
            return 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 50%, #74ebd5 100%)';
        }
        if (temp <= 0) {
            return 'linear-gradient(135deg, #0a2342 0%, #274472 50%, #0a2342 100%)';
        } else if (temp > 0 && temp <= 10) {
            return 'linear-gradient(135deg, #0f2027 0%, #2c5364 50%, #0f2027 100%)';
        } else if (temp > 10 && temp <= 25) {
            return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)';
        } else if (temp > 25 && temp <= 32) {
            return 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 50%, #74ebd5 100%)';
        } else if (temp > 32 && temp <= 50) {
            return 'linear-gradient(135deg, #56ccf2 0%, #2f80ed 50%, #56ccf2 100%)';
        } else if (temp > 50 && temp <= 65) {
            return 'linear-gradient(135deg, #43cea2 0%, #185a9d 50%, #43cea2 100%)';
        } else if (temp > 65 && temp <= 80) {
            return 'linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #f7971e 100%)';
        } else if (temp > 80 && temp <= 90) {
            return 'linear-gradient(135deg, #f7971e 0%, #f44336 50%, #f7971e 100%)';
        } else if (temp > 90 && temp <= 100) {
            return 'linear-gradient(135deg, #f85032 0%, rgb(165, 25, 12) 50%, #f85032 100%)';
        } else {
            return 'linear-gradient(135deg, rgb(252, 47, 54) 0%, rgb(111, 19, 16) 50%, rgb(252, 47, 54) 100%)';
        }
    }

    const backgroundGradient = getBackgroundGradient(temperature);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.title = `The Weather For ${displayLocation}`;
        }
    }, [displayLocation]);

    return (
        <div>
            <div className="location-controls">
                <button
                    type="button"
                    className="location-toggle-btn location-controls__button"
                    onClick={() => setShowLocationForm(!showLocationForm)}
                    aria-expanded={showLocationForm}
                    aria-controls="location-switcher-form"
                >
                    {showLocationForm ? 'Hide Location Switcher' : 'Change Location'}
                </button>
                {showLocationForm && (
                    <div className="location-switcher-flydown">
                        <LocationSwitcher show={true} onClose={() => setShowLocationForm(false)} />
                    </div>
                )}
            </div>
            <div className="location-title-wrapper">
                <h1 className="app-title">The Weather For {displayLocation}</h1>
            </div>
            <div
                className="weather-gradient-card"
                style={{ '--weather-gradient': backgroundGradient } as React.CSSProperties}
            >
                <div className="weather-cards-row">
                    <WeatherCard
                        title="US Units"
                        unitSymbol="°F"
                        windLabel="Wind"
                        windUnit="mph"
                        precipitationLabel="Precipitation"
                        reserveSpace={true}
                        isFetchingLocation={isFetchingLocation}
                    />
                    <WeatherCard
                        title="Metric Units"
                        unitSymbol="°C"
                        windLabel="Wind"
                        windUnit="knots"
                        precipitationLabel="Precipitation"
                        reserveSpace={true}
                        isFetchingLocation={isFetchingLocation}
                    />
                </div>
                {latitude !== null && longitude !== null && (
                    <ThreeDayForecast
                        latitude={latitude}
                        longitude={longitude}
                        isLoading={loading || isFetchingLocation}
                    />
                )}
            </div>
        </div>
    );
}
