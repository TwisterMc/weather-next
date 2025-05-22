import { getLatLonFromLocation } from './locationUtils';

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
