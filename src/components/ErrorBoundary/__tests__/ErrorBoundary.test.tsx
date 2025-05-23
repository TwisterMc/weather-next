import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

// Create a component that throws an error
const ThrowError = () => {
    throw new Error('Test error');
};

// Create a component that doesn't throw an error
const NoError = () => <div>No error</div>;

describe('ErrorBoundary', () => {
    beforeEach(() => {
        // Prevent console.error from cluttering test output
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <NoError />
            </ErrorBoundary>
        );

        expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('renders error UI when there is an error', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
        const fallback = <div>Custom error message</div>;
        render(
            <ErrorBoundary fallback={fallback}>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('resets error state when try again button is clicked', () => {
        let shouldThrow = true;
        const ToggleError = () => {
            if (shouldThrow) {
                throw new Error('Test error');
            }
            return <div>No error</div>;
        };

        const { rerender } = render(
            <ErrorBoundary>
                <ToggleError />
            </ErrorBoundary>
        );

        // Verify error UI is shown
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();

        // Click try again button and prevent the error from being thrown
        shouldThrow = false;
        fireEvent.click(screen.getByText('Try again'));

        // Force a rerender with the updated shouldThrow value
        rerender(
            <ErrorBoundary>
                <ToggleError />
            </ErrorBoundary>
        );

        // Verify error is cleared and new content is shown
        expect(screen.getByText('No error')).toBeInTheDocument();
    });
});
