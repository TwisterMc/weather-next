import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import styles from './WeatherDetails.module.css';

export default function WeatherDetails() {
    const weather = useWeather();

    const getTemperatureColor = (temp: number | null, isCelsius: boolean = false): string => {
        if (temp === null) return 'var(--color-primary)';

        // Convert thresholds to Celsius if needed
        if (isCelsius) {
            if (temp <= -17.8) return '#0a2342';  // 0°F
            if (temp <= 0) return '#1e3c72';     // 32°F
            if (temp <= 10) return '#2980b9';    // 50°F
            if (temp <= 18.3) return '#27ae60';  // 65°F
            if (temp <= 23.9) return '#f39c12';  // 75°F
            if (temp <= 29.4) return '#e67e22';  // 85°F
            if (temp <= 35) return '#d35400';    // 95°F
            return '#c0392b';                    // >95°F
        }

        // Fahrenheit thresholds
        if (temp <= 0) return '#0a2342';   // Very cold - dark blue
        if (temp <= 32) return '#1e3c72';  // Freezing - blue
        if (temp <= 50) return '#2980b9';  // Cold - lighter blue
        if (temp <= 65) return '#27ae60';  // Cool - green
        if (temp <= 75) return '#f39c12';  // Warm - orange
        if (temp <= 85) return '#e67e22';  // Hot - darker orange
        if (temp <= 95) return '#d35400';  // Very hot - orange red
        return '#c0392b';                  // Extremely hot - red
    };

    const weatherTiles = [
        {
            label: 'UV Index',
            value: weather.uvIndex ?? '--',
            unit: 'UV',
            color: '#FF9500',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.metricIcon} style={{ fill: '#FF9500' }}>
                    <path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391l-19.9 107.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121l19.9-107.9c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1l90.3-62.3c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" />
                </svg>
            )
        },
        {
            label: 'Feels Like',
            value: `${weather.feelsLike ?? '--'}°`,
            unit: 'Fahrenheit',
            color: '#007AFF',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.metricIcon} style={{ fill: '#007AFF' }}>
                    <path d="M416 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm0 128A96 96 0 1 0 416 0a96 96 0 1 0 0 192zM96 112c0-26.5 21.5-48 48-48s48 21.5 48 48V276.5c0 17.3 7.1 31.9 15.3 42.5C217.8 332.6 224 349.5 224 368c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-18.5 6.2-35.4 16.7-48.9C88.9 308.4 96 293.8 96 276.5V112zM144 0C82.1 0 32 50.2 32 112V276.5c0 .1-.1 .3-.2 .6c-.2 .6-.8 1.6-1.7 2.8C11.2 304.2 0 334.8 0 368c0 79.5 64.5 144 144 144s144-64.5 144-144c0-33.2-11.2-63.8-30.1-88.1c-.9-1.2-1.5-2.2-1.7-2.8c-.1-.3-.2-.5-.2-.6V112C256 50.2 205.9 0 144 0zm0 416c26.5 0 48-21.5 48-48c0-20.9-13.4-38.7-32-45.3V112c0-8.8-7.2-16-16-16s-16 7.2-16 16V322.7c-18.6 6.6-32 24.4-32 45.3c0 26.5 21.5 48 48 48z" />
                </svg>
            )
        },
        {
            label: 'Wind Speed',
            value: weather.windSpeed ?? '--',
            unit: 'MPH',
            color: '#32ADE6',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.metricIcon} style={{ fill: '#32ADE6' }}>
                    <path d="M288 32c0 17.7 14.3 32 32 32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c53 0 96-43 96-96s-43-96-96-96H320c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384c-17.7 0-32 14.3-32 32zM128 512h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H160c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32z" />
                </svg>
            )
        },
        {
            label: 'Precipitation',
            value: weather.precipChance ?? '--',
            unit: '% Chance',
            color: '#32ADE6',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={styles.metricIcon} style={{ fill: '#32ADE6' }}>
                    <path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z" />
                </svg>
            )
        },
        {
            label: 'Temperature (C)',
            value: `${weather.temperatureC ? Math.round(typeof weather.temperatureC === 'string' ? parseFloat(weather.temperatureC) : weather.temperatureC) : '--'}°`,
            unit: 'Celsius',
            customStyle: true,
            className: styles.temperatureValue,
            color: getTemperatureColor(typeof weather.temperatureC === 'string' ? parseFloat(weather.temperatureC) : weather.temperatureC, true),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className={styles.metricIcon} style={{ fill: '#5856D6' }}>
                    <path d="M160 64c-26.5 0-48 21.5-48 48V276.5c0 17.3-7.1 31.9-15.3 42.5C86.2 332.6 80 349.5 80 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5V112c0-26.5-21.5-48-48-48zM48 112C48 50.2 98.1 0 160 0s112 50.2 112 112V276.5c0 .1 .1 .3 .2 .6c.2 .6 .8 1.6 1.7 2.8c18.9 24.4 30.1 55 30.1 88.1c0 79.5-64.5 144-144 144S16 447.5 16 368c0-33.2 11.2-63.8 30.1-88.1c.9-1.2 1.5-2.2 1.7-2.8c.1-.3 .2-.5 .2-.6V112zM208 368c0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3V144c0-8.8 7.2-16 16-16s16 7.2 16 16V322.7c18.6 6.6 32 24.4 32 45.3z" />
                </svg>
            )
        },
        {
            label: 'Relative Humidity',
            value: weather.humidity ?? '--',
            unit: '%',
            color: '#5856D6',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={styles.metricIcon} style={{ fill: '#5856D6' }}>
                    <path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z" />
                </svg>
            )
        },
        {
            label: 'Dew Point',
            value: weather.dewPoint ? `${weather.dewPoint.toFixed(1)}°` : '--',
            unit: 'Fahrenheit',
            color: '#5856D6',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={styles.metricIcon} style={{ fill: '#5856D6' }}>
                    <path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zm0-448c-26.5 0-48 21.5-48 48v164.5c0 17.3-7.1 31.9-15.3 42.5C118.2 332.6 112 349.5 112 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5V112c0-26.5-21.5-48-48-48z"/>
                </svg>
            )
        },
        {
            label: 'Visibility',
            value: weather.visibility ? `${(weather.visibility / 1000).toFixed(1)}` : '--',
            unit: 'km',
            color: '#34C759',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className={styles.metricIcon} style={{ fill: '#34C759' }}>
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                </svg>
            )
        },
        {
            label: 'Surface Pressure',
            value: weather.pressure ? `${weather.pressure.toFixed(1)}` : '--',
            unit: 'hPa',
            color: '#34C759',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.metricIcon} style={{ fill: '#34C759' }}>
                    <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3V88c0-13.3-10.7-24-24-24s-24 10.7-24 24V292.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className={styles.grid}>
            {/* Temperature - Large Tile */}
            <div className={`${styles.tile} ${styles.temperatureTile}`}>
                <h2
                    className={styles.temperatureValue}
                    style={{ color: getTemperatureColor(weather.temperature) }}
                >
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
                <div className={styles.unit}>Code: {weather.weatherCode ?? '--'}</div>
            </section>

            {/* Location - Wide Tile */}
            <section className={`${styles.tile} ${styles.locationTile}`}>
                <div className={styles.label}>Location</div>
                <div className={styles.locationValue}>
                    <svg
                        className={styles.locationIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        aria-hidden="true"
                        focusable="false"
                        style={{ fill: '#007AFF' }}
                    >
                        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
                    </svg>
                    {weather.displayLocation || `${weather.city}${weather.state ? ', ' + weather.state : ''}` || '--'}
                </div>
            </section>

            {/* Weather Detail Tiles */}
            {weatherTiles.map((item) => (
                <section key={item.label} className={styles.tile}>
                    <div className={styles.label}>{item.label}</div>
                    {item.icon}
                    <div
                        className={item.customStyle ? item.className : styles.value}
                        style={{ color: item.color }}
                    >
                        {item.value}
                    </div>
                    <div className={styles.unit}>{item.unit}</div>
                </section>
            ))}

            {/* Coordinates */}
            <section className={styles.tile}>
                <div className={styles.label}>Coordinates</div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className={styles.metricIcon}
                    style={{ fill: '#007AFF' }}
                >
                    <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
                </svg>
                <div className={styles.coordinatesValue}>
                    <div>{weather.latitude ? `${weather.latitude.toFixed(4)}°N` : '--'}</div>
                    <div>{weather.longitude ? `${weather.longitude.toFixed(4)}°W` : '--'}</div>
                </div>
            </section>
        </div>
    );
}
