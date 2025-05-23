import { getWeatherIcon, getConditionText, weatherMap } from '../weatherUtils';

describe('weatherUtils', () => {
    describe('getWeatherIcon', () => {
        it('returns the correct icon for known weather codes', () => {
            expect(getWeatherIcon(0)).toBe('☀️'); // Clear sky
            expect(getWeatherIcon(3)).toBe('☁️'); // Overcast
            expect(getWeatherIcon(95)).toBe('⛈️'); // Thunderstorm
        });

        it('returns a question mark for unknown weather codes', () => {
            expect(getWeatherIcon(-1)).toBe('❓');
            expect(getWeatherIcon(100)).toBe('❓');
        });
    });

    describe('getConditionText', () => {
        it('returns the correct text for known weather codes', () => {
            expect(getConditionText(0)).toBe('Clear sky');
            expect(getConditionText(3)).toBe('Overcast');
            expect(getConditionText(95)).toBe('Thunderstorm');
        });

        it('returns "Unknown" for unknown weather codes', () => {
            expect(getConditionText(-1)).toBe('Unknown');
            expect(getConditionText(100)).toBe('Unknown');
        });
    });

    describe('weatherMap', () => {
        it('contains all required weather codes', () => {
            const requiredCodes = [
                0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96,
                99,
            ];
            requiredCodes.forEach((code) => {
                expect(weatherMap[code]).toBeDefined();
                expect(weatherMap[code].icon).toBeDefined();
                expect(weatherMap[code].text).toBeDefined();
            });
        });
    });
});
