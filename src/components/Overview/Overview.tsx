'use client';
import React, { useEffect } from 'react';
import { getLatLonFromLocation } from '@/utils/locationUtils';
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
        city,
        state,
        zip,
        locError,
        displayLocation,
        isFetchingLocation,
        showLocationForm,
        setLatitude,
        setLongitude,
        setCity,
        setState,
        setZip,
        setShowLocationForm,
        refreshWeatherData,
    } = useWeather();

    useEffect(() => {
        refreshWeatherData();
        // eslint-disable-next-line
    }, [latitude, longitude]);

    function getBackgroundGradient(temp: number | null) {
        if (temp === null || isNaN(temp)) {
            return 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)';
        }
        if (temp <= 0) {
            return 'linear-gradient(135deg, #0a2342 0%, #274472 100%)';
        } else if (temp > 0 && temp <= 10) {
            return 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)';
        } else if (temp > 10 && temp <= 25) {
            return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
        } else if (temp > 25 && temp <= 32) {
            return 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)';
        } else if (temp > 32 && temp <= 50) {
            return 'linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)';
        } else if (temp > 50 && temp <= 65) {
            return 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)';
        } else if (temp > 65 && temp <= 80) {
            return 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)';
        } else if (temp > 80 && temp <= 90) {
            return 'linear-gradient(135deg, #f7971e 0%, #f44336 100%)';
        } else if (temp > 90 && temp <= 100) {
            return 'linear-gradient(135deg, #f85032 0%, #e73827 100%)';
        } else {
            return 'linear-gradient(135deg, #b31217 0%, #e52d27 100%)';
        }
    }

    const backgroundGradient = getBackgroundGradient(temperature);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.title = `The Weather For ${displayLocation || 'Your Location'}`;
        }
    }, [displayLocation]);

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 24,
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                <button
                    type="button"
                    className="location-toggle-btn"
                    onClick={() => setShowLocationForm(!showLocationForm)}
                    aria-expanded={showLocationForm}
                    aria-controls="location-switcher-form"
                    style={{ position: 'relative', zIndex: 11 }}
                >
                    {showLocationForm ? 'Hide Location Switcher' : 'Change Location'}
                </button>
                {showLocationForm && (
                    <div className="location-switcher-flydown">
                        <button
                            type="button"
                            className="location-switcher-flydown__close-btn"
                            aria-label="Close Location Switcher"
                            onClick={() => setShowLocationForm(false)}
                        >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                <path d="M6 6l8 8M14 6l-8 8" stroke="#1a5fa0" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <LocationSwitcher
                            city={city}
                            state={state}
                            zip={zip}
                            locError={locError}
                            setCity={setCity}
                            setState={setState}
                            setZip={setZip}
                            setLocError={() => { }}
                            setIsFetchingLocation={() => { }}
                            setUsedMyLocation={() => { }}
                            getLatLonFromLocation={getLatLonFromLocation}
                            setLatitude={setLatitude}
                            setLongitude={setLongitude}
                            show={true}
                            onClose={() => setShowLocationForm(false)}
                        />
                    </div>
                )}
            </div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h1 className="app-title">The Weather For {displayLocation || 'Your Location'}</h1>
            </div>
            <div className="weather-gradient-card" style={{ background: backgroundGradient }}>
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
                <ThreeDayForecast latitude={latitude} longitude={longitude} isLoading={loading || isFetchingLocation} />
            </div>
        </div>
    );
}
