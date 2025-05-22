import type { Metadata } from 'next';
import './globals.css';
import Footer from '../components/Footer/Footer';
import { WeatherProvider } from '@/context/WeatherContext';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
    title: 'Weather App',
    description: 'Ai Generated Weather App',
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="app-root">
                    <div className="app-container">
                        <WeatherProvider>
                            {children}
                            <Footer />
                        </WeatherProvider>
                    </div>
                </div>
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
