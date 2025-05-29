'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useWeather } from '@/context/WeatherContext';
import { useTheme } from '@/context/ThemeContext';
import { useUnit } from '@/context/UnitContext';
import styles from './Header.module.css';
import LocationSwitcher from '@/components/LocationSwitcher/LocationSwitcher';
import Link from 'next/link';

export default function Header() {
    const { city, state, showLocationForm, setShowLocationForm } = useWeather();
    const { theme, toggleTheme } = useTheme();
    const { unitSystem, setUnitSystem } = useUnit();
    const pathname = usePathname();
    const isDetailsPage = pathname === '/details/';

    // Construct the title with consistent formatting
    const pageTitle = isDetailsPage ? 'Weather Details' : 'Weather Dashboard';
    const locationTitle = city && state ? ` for ${city}, ${state}` : '';
    const title = pageTitle + locationTitle;

    console.log(city);
    console.log(state);

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

    const handleUnitToggle = () => {
        setUnitSystem(unitSystem === 'imperial' ? 'metric' : 'imperial');
    };

    return (
        <>
            <a href="#main-content" className={styles.skipLink}>
                Skip to main content
            </a>
            <header className={styles.header} role="banner">
                <div className={styles.titleRow}>
                    <h1 className={styles.title}>{title}</h1>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            flex: 1,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <nav className={styles.navigation} role="navigation" aria-label="Main">
                            <Link
                                href="/"
                                className={styles.navLink}
                                aria-current={!isDetailsPage ? 'page' : undefined}
                            >
                                Dashboard
                            </Link>
                            <span className={styles.navSeparator} aria-hidden="true">
                                |
                            </span>
                            <Link
                                href="/details/"
                                className={styles.navLink}
                                aria-current={isDetailsPage ? 'page' : undefined}
                            >
                                Details
                            </Link>
                        </nav>
                        <div className={styles.buttonGroup} role="group" aria-label="Page settings">
                            {isDetailsPage && (
                                <button
                                    type="button"
                                    onClick={handleUnitToggle}
                                    className={styles.unitToggle}
                                    aria-pressed={unitSystem === 'metric'}
                                    aria-label={`Switch to ${unitSystem === 'imperial' ? 'metric' : 'imperial'} units`}
                                >
                                    <span aria-hidden="true">{unitSystem === 'imperial' ? '°F' : '°C'}</span>
                                </button>
                            )}
                            <button
                                type="button"
                                className={styles.themeToggle}
                                onClick={toggleTheme}
                                aria-pressed={theme === 'dark'}
                                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
                            </button>
                            <button
                                type="button"
                                className={styles.locationToggle}
                                onClick={() => setShowLocationForm(!showLocationForm)}
                                aria-expanded={showLocationForm}
                                aria-controls="location-switcher-form"
                                aria-haspopup="dialog"
                            >
                                Location
                            </button>
                        </div>
                    </div>
                </div>
                {showLocationForm && (
                    <div
                        className={styles.locationSwitcherWrapper}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Change location"
                    >
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
