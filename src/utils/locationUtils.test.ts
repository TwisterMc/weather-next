import { getLatLonFromLocation, getLocationFromZip } from './locationUtils';

describe('getLatLonFromLocation', () => {
    it('returns lat/lon for a given zip code', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    lat: '34.0901',
                    lon: '-118.4065',
                    city: 'Beverly Hills',
                    state: 'CA',
                    zip: '90210',
                },
            ],
        }) as jest.Mock;
        const result = await getLatLonFromLocation({ zip: '90210' });
        expect(result).toEqual({
            lat: 34.0901,
            lon: -118.4065,
        });
    });
});

describe('getLocationFromZip', () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should return location details for a valid zip code', async () => {
        const mockResponse = {
            places: [
                {
                    'place name': 'Minneapolis',
                    longitude: '-93.2768',
                    latitude: '44.9795',
                    'state abbreviation': 'MN',
                },
            ],
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const result = await getLocationFromZip('55402');

        expect(result).toEqual({
            city: 'Minneapolis',
            state: 'MN',
            latitude: 44.9795,
            longitude: -93.2768,
        });

        expect(mockFetch).toHaveBeenCalledWith('https://api.zippopotam.us/us/55402');
    });

    it('should validate zip code format', async () => {
        await expect(getLocationFromZip('1234')).rejects.toThrow('Invalid zip code format');
        await expect(getLocationFromZip('123456')).rejects.toThrow('Invalid zip code format');
        await expect(getLocationFromZip('abcde')).rejects.toThrow('Invalid zip code format');
    });

    it('should validate zip code format', async () => {
        await expect(getLocationFromZip('1234')).rejects.toThrow('Invalid zip code format');
        await expect(getLocationFromZip('123456')).rejects.toThrow('Invalid zip code format');
        await expect(getLocationFromZip('abcde')).rejects.toThrow('Invalid zip code format');
    });

    it('should handle invalid zip codes', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Invalid zip code'));

        await expect(getLocationFromZip('00000')).rejects.toThrow('Failed to lookup zip code');
    });

    it('should handle invalid JSON response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.reject(new Error('Invalid JSON')),
        });

        await expect(getLocationFromZip('55402')).rejects.toThrow('Invalid response format');
    });

    it('should handle empty response data', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(null),
        });

        await expect(getLocationFromZip('55402')).rejects.toThrow('Invalid response format');
    });

    it('should handle invalid response format', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ 'post code': '55402' }),
        });

        await expect(getLocationFromZip('55402')).rejects.toThrow('Invalid response format');
    });

    it('should handle empty places array', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ places: [] }),
        });

        await expect(getLocationFromZip('55402')).rejects.toThrow('No location found for this zip code');
    });

    it('should handle missing required fields', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    places: [
                        {
                            'place name': 'Test City',
                            'state abbreviation': 'MN',
                            // missing latitude/longitude fields
                        },
                    ],
                }),
        });

        await expect(getLocationFromZip('55402')).rejects.toThrow('Incomplete location data');
    });

    it('should handle invalid coordinates', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    places: [
                        {
                            'place name': 'Test City',
                            'state abbreviation': 'TC',
                            latitude: 'invalid',
                            longitude: 'invalid',
                        },
                    ],
                }),
        });

        await expect(getLocationFromZip('55402')).rejects.toThrow('Invalid coordinates in location data');
    });

    it('should handle network errors', async () => {
        mockFetch.mockImplementationOnce(() => {
            throw new Error('Network error');
        });

        await expect(getLocationFromZip('55402')).rejects.toThrow('Failed to lookup zip code');
    });
});
