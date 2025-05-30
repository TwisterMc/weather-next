import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Header from '../Header';
import { useWeather } from '@/context/WeatherContext';
import { useTheme } from '@/context/ThemeContext';
import { useUnit } from '@/context/UnitContext';

// Mock the Next.js navigation hook
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

// Mock the context hooks
jest.mock('@/context/WeatherContext', () => ({
    useWeather: jest.fn(),
}));

jest.mock('@/context/ThemeContext', () => ({
    useTheme: jest.fn(),
}));

jest.mock('@/context/UnitContext', () => ({
    useUnit: jest.fn(),
}));

describe('Header', () => {
    const mockSetShowLocationForm = jest.fn();
    const mockToggleTheme = jest.fn();
    const mockSetUnitSystem = jest.fn();

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Mock default context values
        (useWeather as jest.Mock).mockReturnValue({
            city: 'Test City',
            state: 'Test State',
            showLocationForm: false,
            setShowLocationForm: mockSetShowLocationForm,
        });

        (useTheme as jest.Mock).mockReturnValue({
            theme: 'light',
            toggleTheme: mockToggleTheme,
        });

        (useUnit as jest.Mock).mockReturnValue({
            unitSystem: 'imperial',
            setUnitSystem: mockSetUnitSystem,
        });

        // Mock default pathname
        (usePathname as jest.Mock).mockReturnValue('/');
    });

    it('renders the header with correct title for dashboard', () => {
        render(<Header />);
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByText('Weather Dashboard for Test City, Test State')).toBeInTheDocument();
    });

    it('renders the header with correct title for details page', () => {
        (usePathname as jest.Mock).mockReturnValue('/details/');
        render(<Header />);
        expect(screen.getByText('Weather Details for Test City, Test State')).toBeInTheDocument();
    });

    it('renders navigation links with correct aria-current', () => {
        render(<Header />);
        const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
        const detailsLink = screen.getByRole('link', { name: 'Details' });

        expect(dashboardLink).toHaveAttribute('aria-current', 'page');
        expect(detailsLink).not.toHaveAttribute('aria-current');
    });

    it('toggles theme when theme button is clicked', () => {
        render(<Header />);
        const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
        fireEvent.click(themeButton);
        expect(mockToggleTheme).toHaveBeenCalled();
    });

    it('toggles location form when location button is clicked', () => {
        render(<Header />);
        const locationButton = screen.getByRole('button', { name: 'Location' });
        fireEvent.click(locationButton);
        expect(mockSetShowLocationForm).toHaveBeenCalledWith(true);
    });

    it('toggles unit system when unit button is clicked on details page', () => {
        (usePathname as jest.Mock).mockReturnValue('/details/');
        render(<Header />);
        const unitButton = screen.getByRole('button', { name: /switch to metric units/i });
        fireEvent.click(unitButton);
        expect(mockSetUnitSystem).toHaveBeenCalledWith('metric');
    });

    it('shows location switcher when showLocationForm is true', () => {
        (useWeather as jest.Mock).mockReturnValue({
            city: 'Test City',
            state: 'Test State',
            showLocationForm: true,
            setShowLocationForm: mockSetShowLocationForm,
        });
        render(<Header />);
        expect(screen.getByRole('dialog', { name: 'Change location' })).toBeInTheDocument();
    });

    it('closes location form when overlay is clicked', () => {
        (useWeather as jest.Mock).mockReturnValue({
            city: 'Test City',
            state: 'Test State',
            showLocationForm: true,
            setShowLocationForm: mockSetShowLocationForm,
        });
        render(<Header />);
        const overlay = screen.getByRole('presentation');
        fireEvent.click(overlay);
        expect(mockSetShowLocationForm).toHaveBeenCalledWith(false);
    });

    it('closes location form when escape key is pressed', () => {
        (useWeather as jest.Mock).mockReturnValue({
            city: 'Test City',
            state: 'Test State',
            showLocationForm: true,
            setShowLocationForm: mockSetShowLocationForm,
        });
        render(<Header />);
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(mockSetShowLocationForm).toHaveBeenCalledWith(false);
    });

    it('renders skip link for accessibility', () => {
        render(<Header />);
        expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    });

    it('updates document title', () => {
        render(<Header />);
        expect(document.title).toBe('Weather Dashboard for Test City, Test State');
    });
});
