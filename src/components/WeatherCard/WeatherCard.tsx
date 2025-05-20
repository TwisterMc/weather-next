import React from 'react';
import './WeatherCardStyles.css';
import { useWeather } from '@/context/WeatherContext';

export default function WeatherCard({
  title,
  unitSymbol,
  windLabel,
  windUnit,
  precipitationLabel,
  reserveSpace,
}: {
  title: string;
  unitSymbol: string;
  windLabel: string;
  windUnit: string;
  precipitationLabel: string;
  reserveSpace?: boolean;
}) {
  const {
    iconUrl,
    condition,
    temperature,
    temperatureC,
    feelsLike,
    windSpeed,
    precipChance,
    loading,
    error
  } = useWeather();

  // Determine which values to display based on unitSymbol
  const displayTemp = unitSymbol === '°C' ? temperatureC : temperature;
  const displayFeelsLike = unitSymbol === '°C'
    ? (feelsLike !== null && typeof feelsLike === 'number' ? ((feelsLike - 32) * 5 / 9).toFixed(1) : null)
    : feelsLike;
  const displayWind = unitSymbol === '°C' && windSpeed !== null
    ? (typeof windSpeed === 'number' ? (windSpeed * 0.868976).toFixed(1) : windSpeed)
    : windSpeed;

  return (
    <header className="weather-card">
      <div className="weather-card__current-label">Current</div>
      <h2 className="weather-card__title">{title}</h2>
      {loading && (
        <div className="weather-card__loading-anim" style={reserveSpace ? { minHeight: 300 } : {}}>
          <div className="weather-card__spinner">
            <div className="weather-card__dot"></div>
            <div className="weather-card__dot"></div>
            <div className="weather-card__dot"></div>
          </div>
          <p className="weather-card__loading">Loading...</p>
        </div>
      )}
      {!loading && error && <p className="weather-card__error">Error: {error}</p>}
      {!loading && displayTemp !== null && !error && (
        <>
          <div className="weather-card__icon-block">
            <span className="weather-card__icon">{iconUrl}</span>
            <span className="weather-card__condition">{condition}</span>
          </div>
          <div className="weather-card__details">
            <span className="weather-card__temp">{displayTemp}{unitSymbol}</span>
            <span><strong>Feels Like:</strong> <span className="weather-card__highlight">{displayFeelsLike !== null ? displayFeelsLike + unitSymbol : 'N/A'}</span></span>
            <span><strong>{windLabel}:</strong> <span className="weather-card__highlight">{displayWind !== null ? displayWind + ' ' + windUnit : 'N/A'}</span></span>
            <span><strong>{precipitationLabel}:</strong> <span className="weather-card__highlight">{precipChance !== null ? precipChance + '%' : 'N/A'}</span></span>
          </div>
        </>
      )}
    </header>
  );
}
