import React from 'react';
import styles from './WeatherCard.module.css';
import { useWeather } from '@/context/WeatherContext';

interface WeatherCardProps {
    title: string;
    unitSymbol: '°F' | '°C';
    windLabel: string;
    windUnit: string;
    precipitationLabel: string;
    reserveSpace?: boolean;
    isFetchingLocation?: boolean;
}

export default function WeatherCard({
    title,
    unitSymbol,
    windLabel,
    windUnit,
    precipitationLabel,
    reserveSpace = false,
    isFetchingLocation = false,
}: WeatherCardProps): React.ReactElement {
    const { iconUrl, condition, temperature, temperatureC, feelsLike, windSpeed, precipChance, loading, error } =
        useWeather();

    // Determine which values to display based on unitSymbol
    const displayTemp = unitSymbol === '°C' ? temperatureC : temperature;
    const displayFeelsLike =
        unitSymbol === '°C'
            ? feelsLike !== null && typeof feelsLike === 'number'
                ? (((feelsLike - 32) * 5) / 9).toFixed(1)
                : null
            : feelsLike;
    const displayWind =
        unitSymbol === '°C' && windSpeed !== null
            ? typeof windSpeed === 'number'
                ? (windSpeed * 0.868976).toFixed(1)
                : windSpeed
            : windSpeed;

    // Loading state with location fetching
    if (isFetchingLocation) {
        return (
            <article className={styles.card} aria-busy="true">
                <div className={styles.currentLabel}>Current</div>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.loadingAnim} style={reserveSpace ? { minHeight: 300 } : {}}>
                    <div className={styles.spinner} role="status">
                        <div className={styles.dot} data-testid="weather-card-dot" aria-hidden="true"></div>
                        <div className={styles.dot} data-testid="weather-card-dot" aria-hidden="true"></div>
                        <div className={styles.dot} data-testid="weather-card-dot" aria-hidden="true"></div>
                    </div>
                    <p className={styles.loading}>Fetching location...</p>
                </div>
            </article>
        );
    }

    return (
        <article className={styles.card}>
            <div className={styles.currentLabel}>Current</div>
            <h2 className={styles.title}>{title}</h2>
            {loading && (
                <div className={styles.loadingAnim} style={reserveSpace ? { minHeight: 300 } : {}} aria-busy="true">
                    <div className={styles.spinner} role="status">
                        <div className={styles.dot} data-testid="weather-card-dot" aria-hidden="true"></div>
                        <div className={styles.dot} data-testid="weather-card-dot" aria-hidden="true"></div>
                        <div className={styles.dot} data-testid="weather-card-dot" aria-hidden="true"></div>
                    </div>
                    <p className={styles.loading}>Loading weather data...</p>
                </div>
            )}
            {!loading && error && (
                <p className={styles.error} role="alert">
                    Error: {error}
                </p>
            )}
            {!loading && displayTemp !== null && !error && (
                <>
                    <div className={styles.iconBlock}>
                        <span className={styles.icon} role="img" aria-label={condition}>
                            {iconUrl}
                        </span>
                        <span className={styles.condition}>{condition}</span>
                    </div>
                    <dl className={styles.details}>
                        <div className={styles.detailItem}>
                            <dt className="sr-only">Temperature</dt>
                            <dd className={styles.temp}>
                                {displayTemp}
                                {unitSymbol}
                            </dd>
                        </div>
                        <div className={styles.detailItem}>
                            <dt>Feels Like</dt>
                            <dd className={styles.highlight}>
                                {displayFeelsLike !== null ? displayFeelsLike + unitSymbol : 'N/A'}
                            </dd>
                        </div>
                        <div className={styles.detailItem}>
                            <dt>{windLabel}</dt>
                            <dd className={styles.highlight}>
                                {displayWind !== null ? displayWind + ' ' + windUnit : 'N/A'}
                            </dd>
                        </div>
                        <div className={styles.detailItem}>
                            <dt>{precipitationLabel}</dt>
                            <dd className={styles.highlight}>{precipChance !== null ? precipChance + '%' : 'N/A'}</dd>
                        </div>
                    </dl>
                </>
            )}
        </article>
    );
}
