"use client";
import React from 'react';

import styles from './details.module.css';
import WeatherDetails from '@/components/WeatherDetails/WeatherDetails';

export default function DetailsPage() {
    return (
        <main className={styles.detailsPage}>
            <WeatherDetails />
        </main>
    );
}

