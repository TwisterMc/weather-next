'use client';

import React from 'react';
import { WeatherProvider } from '@/context/WeatherContext';
import Footer from '@/components/Footer/Footer';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WeatherProvider>
            {children}
            <Footer />
        </WeatherProvider>
    );
}
