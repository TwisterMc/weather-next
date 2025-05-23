export interface WeatherMapEntry {
    icon: string;
    text: string;
}

export type WeatherMap = Record<number, WeatherMapEntry>;

// Weather code to icon/text map
export const weatherMap: WeatherMap = {
    0: { icon: '☀️', text: 'Clear sky' },
    1: { icon: '🌤️', text: 'Mainly clear' },
    2: { icon: '⛅', text: 'Partly cloudy' },
    3: { icon: '☁️', text: 'Overcast' },
    45: { icon: '🌫️', text: 'Fog' },
    48: { icon: '🌫️', text: 'Depositing rime fog' },
    51: { icon: '🌦️', text: 'Light drizzle' },
    53: { icon: '🌦️', text: 'Moderate drizzle' },
    55: { icon: '🌦️', text: 'Dense drizzle' },
    56: { icon: '🌧️', text: 'Light freezing drizzle' },
    57: { icon: '🌧️', text: 'Dense freezing drizzle' },
    61: { icon: '🌦️', text: 'Slight rain' },
    63: { icon: '🌦️', text: 'Moderate rain' },
    65: { icon: '🌧️', text: 'Heavy rain' },
    66: { icon: '🌧️', text: 'Light freezing rain' },
    67: { icon: '🌧️', text: 'Heavy freezing rain' },
    71: { icon: '🌨️', text: 'Slight snow fall' },
    73: { icon: '🌨️', text: 'Moderate snow fall' },
    75: { icon: '❄️', text: 'Heavy snow fall' },
    77: { icon: '❄️', text: 'Snow grains' },
    80: { icon: '🌦️', text: 'Slight rain showers' },
    81: { icon: '🌦️', text: 'Moderate rain showers' },
    82: { icon: '🌧️', text: 'Violent rain showers' },
    85: { icon: '🌨️', text: 'Slight snow showers' },
    86: { icon: '🌨️', text: 'Heavy snow showers' },
    95: { icon: '⛈️', text: 'Thunderstorm' },
    96: { icon: '⛈️', text: 'Thunderstorm with slight hail' },
    99: { icon: '⛈️', text: 'Thunderstorm with heavy hail' },
};

export function getWeatherIcon(code: number): string {
    return weatherMap[code]?.icon || '❓';
}

export function getConditionText(code: number): string {
    return weatherMap[code]?.text || 'Unknown';
}
