'use client';

import React, { useEffect } from 'react';
import { useWeather, WeatherProvider } from '@/context/WeatherContext';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
    const { refreshWeatherData } = useWeather();

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
            <main id="main-content">
                {children}
            </main>
            <Footer />
        </>
    );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <WeatherProvider>
            <ClientLayoutContent>{children}</ClientLayoutContent>
        </WeatherProvider>
    );
}
