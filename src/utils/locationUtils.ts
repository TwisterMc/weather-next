// Types for location input
export interface LocationInput {
    city?: string;
    state?: string;
    zip?: string;
}

export interface LatLon {
    lat: number;
    lon: number;
}

export interface LocationDetails {
    city: string;
    state: string;
    zip: string;
}

// Utility to fetch lat/lon from city/state or zip using Nominatim
export async function getLatLonFromLocation({ city, state, zip }: LocationInput): Promise<LatLon> {
    let query = '';
    if (zip) {
        query = encodeURIComponent(zip);
    } else if (city && state) {
        query = encodeURIComponent(`${city}, ${state}`);
    } else {
        throw new Error('Please provide a city and state or a zip code.');
    }
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
    const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!response.ok) throw new Error('Location lookup failed');
    const data: Array<{ lat: string; lon: string }> = await response.json();
    if (data.length === 0 || !data[0]) throw new Error('Location not found');
    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
    };
}

export async function getLocationFromLatLon(lat: number, lon: number): Promise<LocationDetails> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    const response = await fetch(url, {
        headers: {
            'Accept-Language': 'en',
            'User-Agent': 'WeatherApp/1.0',
        },
    });

    if (!response.ok) throw new Error('Location lookup failed');

    const data = await response.json();
    if (!data.address) throw new Error('Location details not found');

    const address = data.address;
    return {
        city: address.city || address.town || address.village || address.hamlet || '',
        state: address.state || '',
        zip: address.postcode || '',
    };
}

export async function getLocationFromZip(zipCode: string): Promise<{ city: string; state: string; latitude: number; longitude: number }> {
    try {
        const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
        if (!response.ok) {
            throw new Error('Invalid zip code');
        }
        const data = await response.json();
        if (!data.places || !data.places[0]) {
            throw new Error('No location found for this zip code');
        }
        return {
            city: data.places[0]['place name'],
            state: data.places[0]['state abbreviation'],
            latitude: parseFloat(data.places[0].latitude),
            longitude: parseFloat(data.places[0].longitude)
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to lookup zip code';
        throw new Error(message);
    }
}
