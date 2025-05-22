'use client';

import React from 'react';
import { WeatherProvider } from '@/context/WeatherContext';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WeatherProvider>
            <Header />
            {children}
            <Footer />
        </WeatherProvider>
    );
}
