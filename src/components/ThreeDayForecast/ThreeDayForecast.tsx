import React, { useEffect, useState } from 'react';
import { getWeatherIcon, getConditionText } from '../../utils/weatherUtils';
import './ThreeDayForecastStyles.css';

interface ThreeDayForecastProps {
    latitude: number;
    longitude: number;
    isLoading?: boolean;
}

interface ForecastDay {
    date: string;
    maxF: number | null;
    minF: number | null;
    maxC: string | null;
    minC: string | null;
    code: number;
}

export default function ThreeDayForecast({ latitude, longitude, isLoading }: ThreeDayForecastProps) {
    const [forecast, setForecast] = useState<ForecastDay[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchWeatherData();
        // eslint-disable-next-line
    }, [latitude, longitude]);

    function fetchWeatherData() {
        setLoading(true);
        setError(null);
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timezone=America%2FChicago`
        )
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch forecast');
                return res.json();
            })
            .then((data) => {
                if (
                    !data.daily ||
                    !data.daily.temperature_2m_max ||
                    !data.daily.temperature_2m_min ||
                    !data.daily.weather_code
                ) {
                    setForecast([]);
                    setLoading(false);
                    return;
                }
                const today = new Date();
                const allDays: ForecastDay[] = data.daily.time.map((date: string, i: number) => {
                    const maxF = data.daily.temperature_2m_max[i];
                    const minF = data.daily.temperature_2m_min[i];
                    return {
                        date,
                        maxF: typeof maxF === 'number' ? maxF : null,
                        minF: typeof minF === 'number' ? minF : null,
                        maxC: typeof maxF === 'number' ? (((maxF - 32) * 5) / 9).toFixed(1) : null,
                        minC: typeof minF === 'number' ? (((minF - 32) * 5) / 9).toFixed(1) : null,
                        code: data.daily.weather_code[i],
                    };
                });
                const filtered = allDays.filter((day) => {
                    const d = new Date(day.date);
                    d.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);
                    return d >= today;
                });
                setForecast(filtered.slice(0, 4));
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });
    }

    function getDayLabel(dateStr: string): string {
        const today = new Date();
        const date = new Date(dateStr);
        if (
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth() &&
            today.getDate() === date.getDate()
        ) {
            return 'Today';
        }
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    }

    return (
        <div className="three-day-forecast">
            {(isLoading ?? loading) && (
                <div className="three-day-forecast__row">
                    {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className="three-day-forecast__card three-day-forecast__card--loading">
                            <div className="sun-skeleton" aria-label="Loading forecast" />
                        </div>
                    ))}
                </div>
            )}
            {error && <div style={{ color: '#e74c3c' }}>Error: {error}</div>}
            {!loading && !error && !isLoading && (
                <div className="three-day-forecast__row">
                    {forecast.map((day, idx) => (
                        <div key={day.date} className={`three-day-forecast__card`}>
                            <div
                                className={`three-day-forecast__date${idx === 0 ? ' three-day-forecast__date--today' : ''}`}
                            >
                                {getDayLabel(day.date)}
                            </div>
                            <div className="three-day-forecast__icon">{getWeatherIcon(day.code)}</div>
                            <div className="three-day-forecast__condition">{getConditionText(day.code)}</div>
                            {day.maxF !== null && day.minF !== null ? (
                                <div className="three-day-forecast__temps">
                                    <span>
                                        <span style={{ fontWeight: 700 }}>{Math.round(day.maxF)}°F</span> /{' '}
                                        <span style={{ fontWeight: 500 }}>{Math.round(day.minF)}°F</span>
                                    </span>
                                    <span className="three-day-forecast__temps-c">
                                        <span style={{ fontWeight: 700 }}>{day.maxC}°C</span> /{' '}
                                        <span style={{ fontWeight: 500 }}>{day.minC}°C</span>
                                    </span>
                                </div>
                            ) : (
                                <div className="three-day-forecast__na">N/A</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
