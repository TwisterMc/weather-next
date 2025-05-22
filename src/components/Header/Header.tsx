'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useWeather } from '@/context/WeatherContext';
import styles from './Header.module.css';
import LocationSwitcher from '@/components/LocationSwitcher/LocationSwitcher';

export default function Header() {
    const { city, state, showLocationForm, setShowLocationForm } = useWeather();
    const pathname = usePathname();
    const isDetailsPage = pathname === '/details';

    // Construct the title with consistent formatting
    const pageTitle = isDetailsPage ? 'Weather Details' : 'Weather Dashboard';
    const locationTitle = city && state ? ` for ${city}, ${state}` : '';
    const title = pageTitle + locationTitle;

    // Update document title
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <header className={styles.header}>
            <div className={styles.titleRow}>
                <h1 className={styles.title}>{title}</h1>
                <button
                    type="button"
                    className={styles.locationToggle}
                    onClick={() => setShowLocationForm(!showLocationForm)}
                    aria-expanded={showLocationForm}
                    aria-controls="location-switcher-form"
                >
                    {showLocationForm ? 'Hide Location' : 'Change Location'}
                </button>
            </div>
            {showLocationForm && (
                <div className={styles.locationSwitcher}>
                    <LocationSwitcher
                        show={true}
                        onClose={() => setShowLocationForm(false)}
                    />
                </div>
            )}
        </header>
    );
}
