'use client';

import React, { useEffect } from 'react';
import { useWeather, WeatherProvider } from '@/context/WeatherContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UnitProvider } from '@/context/UnitContext';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { usePageFocus } from '@/hooks/usePageFocus';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
    const { refreshWeatherData } = useWeather();
    usePageFocus();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Refresh data with 'R' key
            if (event.key.toLowerCase() === 'r' && !event.metaKey && !event.ctrlKey) {
                refreshWeatherData();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [refreshWeatherData]);

    return (
        <>
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>
            <Header />
            <main id="main-content" tabIndex={-1}>
                {children}
            </main>
            <Footer />
        </>
    );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <WeatherProvider>
                    <UnitProvider>
                        <ClientLayoutContent>{children}</ClientLayoutContent>
                    </UnitProvider>
                </WeatherProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
