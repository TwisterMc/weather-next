'use client';
import './Footer.css';
import { useWeather } from '@/context/WeatherContext';

export default function Footer() {
    const { lastUpdated, refreshWeatherData } = useWeather();
    return (
        <footer className="app-footer">
            <section className="last-updated-row">
                <span className="last-updated-label">Last updated: {lastUpdated ? lastUpdated : '—'}</span>
                <button
                    type="button"
                    className="last-updated-btn"
                    onClick={refreshWeatherData}
                    aria-label="Refresh weather data"
                >
                    Refresh
                </button>
            </section>
            Weather data provided by{' '}
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="app-footer__link">
                Open-Meteo
            </a>
            . Built by{' '}
            <a href="https://www.twistermc.com" target="_blank" rel="noopener noreferrer" className="app-footer__link">
                TwisterMc
            </a>{' '}
            at{' '}
            <a href="https://nerdery.com" target="_blank" rel="noopener noreferrer" className="app-footer__link">
                Nerdery
            </a>{' '}
            with GitHub Copilot.
        </footer>
    );
}
