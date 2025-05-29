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
            'post code': '55402',
            places: [
                {
                    'place name': 'Minneapolis',
                    'state abbreviation': 'MN',
                    latitude: '44.9795',
                    longitude: '-93.2768'
                }
            ]
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const result = await getLocationFromZip('55402');

        expect(result).toEqual({
            city: 'Minneapolis',
            state: 'MN',
            latitude: 44.9795,
            longitude: -93.2768
        });

        expect(mockFetch).toHaveBeenCalledWith('https://api.zippopotam.us/us/55402');
    });

    it('should handle invalid zip codes', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        await expect(getLocationFromZip('00000')).rejects.toThrow('Invalid zip code');
    });

    it('should handle API errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(getLocationFromZip('55402')).rejects.toThrow();
    });
});
