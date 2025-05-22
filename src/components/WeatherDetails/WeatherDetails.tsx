import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import styles from './WeatherDetails.module.css';

export default function WeatherDetails() {
    const weather = useWeather();

    const weatherTiles = [
        {
            label: 'UV Index',
            value: weather.uvIndex ?? '--',
            unit: 'UV',
            color: '#FF9500'
        },
        {
            label: 'Feels Like',
            value: `${weather.feelsLike ?? '--'}°`,
            unit: 'Fahrenheit',
            color: '#007AFF'
        },
        {
            label: 'Wind Speed',
            value: weather.windSpeed ?? '--',
            unit: 'MPH',
            color: '#32ADE6'
        },
        {
            label: 'Precipitation',
            value: weather.precipChance ?? '--',
            unit: '% Chance',
            color: '#32ADE6'
        },
        {
            label: 'Temperature (C)',
            value: `${weather.temperatureC ?? '--'}°`,
            unit: 'Celsius',
            color: '#007AFF'
        },
        {
            label: 'Relative Humidity',
            value: weather.humidity ?? '--',
            unit: '%',
            color: '#5856D6'
        },
        {
            label: 'Dew Point',
            value: weather.dewPoint ? `${weather.dewPoint.toFixed(1)}°` : '--',
            unit: 'Fahrenheit',
            color: '#5856D6'
        },
        {
            label: 'Visibility',
            value: weather.visibility ? `${(weather.visibility / 1000).toFixed(1)}` : '--',
            unit: 'km',
            color: '#34C759'
        },
        {
            label: 'Surface Pressure',
            value: weather.pressure ? `${weather.pressure.toFixed(1)}` : '--',
            unit: 'hPa',
            color: '#34C759'
        }
    ];

    return (
        <div className={styles.grid}>
            {/* Temperature - Large Tile */}
            <div className={`${styles.tile} ${styles.temperatureTile}`}>
                <h2 className={styles.temperatureValue}>
                    {weather.temperature ?? '--'}°
                </h2>
                <p className={styles.temperatureLabel}>
                    Current Temperature
                </p>
            </div>

            {/* Current Conditions - Wide Tile */}
            <section className={`${styles.tile} ${styles.conditionsTile}`}>
                <div className={styles.label}>Current Conditions</div>
                <div className={styles.conditionsValue}>
                    <span className={styles.conditionsIcon}>{weather.iconUrl}</span>
                    <span>{weather.condition || '--'}</span>
                </div>
            </section>

            {/* Location - Wide Tile */}
            <section className={`${styles.tile} ${styles.locationTile}`}>
                <div className={styles.label}>Location</div>
                <div className={styles.locationValue}>
                    <span style={{ color: '#007AFF' }}>📍</span>
                    {weather.displayLocation || `${weather.city}${weather.state ? ', ' + weather.state : ''}` || '--'}
                </div>
            </section>

            {/* Weather Detail Tiles */}
            {weatherTiles.map((item) => (
                <section key={item.label} className={styles.tile}>
                    <div className={styles.label}>{item.label}</div>
                    <div className={styles.value} style={{ color: item.color }}>
                        {item.value}
                    </div>
                    <div className={styles.unit}>{item.unit}</div>
                </section>
            ))}

            {/* Coordinates */}
            <section className={styles.tile}>
                <div className={styles.label}>Coordinates</div>
                <div className={styles.coordinatesValue}>
                    <div>{weather.latitude ? `${weather.latitude.toFixed(4)}°N` : '--'}</div>
                    <div>{weather.longitude ? `${weather.longitude.toFixed(4)}°W` : '--'}</div>
                </div>
            </section>
        </div>
    );
}
