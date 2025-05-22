"use client";

import React, { useEffect } from 'react';
import styles from './details.module.css';
import WeatherDetails from '@/components/WeatherDetails/WeatherDetails';
import { useWeather } from '@/context/WeatherContext';

export default function DetailsPage() {
    const { city, state } = useWeather();

    useEffect(() => {
        if (city && state) {
            document.title = `Weather Details for ${city}, ${state}`;
        }
    }, [city, state]);

    return (
        <main className={styles.detailsPage}>
            <h1 className={styles.pageTitle}>Weather Details for {city}, {state}</h1>
            <WeatherDetails />
        </main>
    );
}

