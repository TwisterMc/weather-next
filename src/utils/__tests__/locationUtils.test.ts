import { getLatLonFromLocation, getLocationFromLatLon } from '../locationUtils';

// Mock fetch globally
global.fetch = jest.fn();

describe('locationUtils', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('getLatLonFromLocation', () => {
        it('handles zip code lookup', async () => {
            const mockResponse = [{ lat: '45.5155', lon: '-122.6789' }];
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await getLatLonFromLocation({ zip: '97201' });
            expect(result).toEqual({ lat: 45.5155, lon: -122.6789 });
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('97201'), expect.any(Object));
        });

        it('handles city and state lookup', async () => {
            const mockResponse = [{ lat: '45.5155', lon: '-122.6789' }];
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await getLatLonFromLocation({ city: 'Portland', state: 'OR' });
            expect(result).toEqual({ lat: 45.5155, lon: -122.6789 });
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('Portland%2C%20OR'), expect.any(Object));
        });

        it('throws error when no location is found', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

            await expect(getLatLonFromLocation({ zip: '00000' })).rejects.toThrow('Location not found');
        });

        it('throws error when neither zip nor city/state is provided', async () => {
            await expect(getLatLonFromLocation({})).rejects.toThrow('Please provide a city and state or a zip code');
        });
    });

    describe('getLocationFromLatLon', () => {
        it('returns location details from coordinates', async () => {
            const mockResponse = {
                address: {
                    city: 'Portland',
                    state: 'Oregon',
                    postcode: '97201',
                },
            };
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await getLocationFromLatLon(45.5155, -122.6789);
            expect(result).toEqual({
                city: 'Portland',
                state: 'Oregon',
                zip: '97201',
            });
        });

        it('handles missing city by using alternative fields', async () => {
            const mockResponse = {
                address: {
                    town: 'Small Town',
                    state: 'Oregon',
                    postcode: '97000',
                },
            };
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await getLocationFromLatLon(45.5155, -122.6789);
            expect(result.city).toBe('Small Town');
        });

        it('throws error when address is not found', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({}),
            });

            await expect(getLocationFromLatLon(0, 0)).rejects.toThrow('Location details not found');
        });
    });
});
