'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useWeather } from '@/context/WeatherContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './Header.module.css';
import LocationSwitcher from '@/components/LocationSwitcher/LocationSwitcher';

export default function Header() {
    const { city, state, showLocationForm, setShowLocationForm } = useWeather();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const isDetailsPage = pathname === '/details/';

    // Construct the title with consistent formatting
    const pageTitle = isDetailsPage ? 'Weather Details' : 'Weather Dashboard';
    const locationTitle = city && state ? ` for ${city}, ${state}` : '';
    const title = pageTitle + locationTitle;

    // Update document title
    useEffect(() => {
        document.title = title;
    }, [title]);

    // Close modal when escape key is pressed
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showLocationForm) {
                setShowLocationForm(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [showLocationForm, setShowLocationForm]);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button
                            type="button"
                            className={styles.locationToggle}
                            onClick={() => setShowLocationForm(!showLocationForm)}
                            aria-expanded={showLocationForm}
                            aria-controls="location-switcher-form"
                        >
                            {'Change Location'}
                        </button>
                    </div>
                </div>
                {showLocationForm && (
                    <div className={styles.locationSwitcherWrapper}>
                        <div
                            className={styles.overlay}
                            onClick={() => setShowLocationForm(false)}
                            role="presentation"
                        />
                        <div className={styles.locationSwitcher}>
                            <LocationSwitcher show={true} onClose={() => setShowLocationForm(false)} />
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
