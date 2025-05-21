import React from 'react';
import './LocationSwitcher.css';
import { getLatLonFromLocation, getLocationFromLatLon } from '@/utils/locationUtils';
import { useWeather } from '@/context/WeatherContext';

type LocationSwitcherProps = {
    show: boolean;
    onClose?: () => void;
};

export default function LocationSwitcher({ show, onClose }: LocationSwitcherProps) {
    const {
        locError,
        setLocError,
        setIsFetchingLocation,
        setUsedMyLocation,
        setLatitude,
        setLongitude,
        setCity,
        setState,
        setZip
    } = useWeather();

    const [searchInput, setSearchInput] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocError('');
        setIsFetchingLocation(true);
        setUsedMyLocation(false);

        try {
            const input = searchInput.trim();
            let locationQuery = {};

            // Check if input is a ZIP code (5 digits)
            if (/^\d{5}$/.test(input)) {
                locationQuery = { zip: input };
                setZip(input);
                setCity('');
                setState('');
            } else {
                // Try to parse city and state from input (e.g., "Portland, OR" or "Portland")
                const match = input.match(/^([^,]+)(?:,\s*(\w{2}))?$/);
                if (match) {
                    const [, cityPart, statePart] = match;
                    locationQuery = {
                        city: cityPart.trim(),
                        state: statePart ? statePart.trim() : ''
                    };
                    setCity(cityPart.trim());
                    setState(statePart ? statePart.trim() : '');
                    setZip('');
                } else {
                    throw new Error('Please enter a ZIP code or city (optionally with state abbreviation)');
                }
            }

            const result = await getLatLonFromLocation(locationQuery);
            const details = await getLocationFromLatLon(result.lat, result.lon);

            // Update all location details
            setLatitude(result.lat);
            setLongitude(result.lon);
            setCity(details.city);
            setState(details.state);
            if (details.zip) setZip(details.zip);

            setIsFetchingLocation(false);
            if (onClose) {
                onClose();
            }
        } catch (err) {
            setLocError(err instanceof Error ? err.message : String(err));
            setIsFetchingLocation(false);
        }
    };

    const handleUseMyLocation = () => {
        setLocError('');
        setIsFetchingLocation(true);
        setUsedMyLocation(true);
        setSearchInput('');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const details = await getLocationFromLatLon(pos.coords.latitude, pos.coords.longitude);
                        setLatitude(pos.coords.latitude);
                        setLongitude(pos.coords.longitude);
                        setCity(details.city);
                        setState(details.state);
                        setZip(details.zip);
                        setIsFetchingLocation(false);
                        if (onClose) {
                            onClose();
                        }
                    } catch (err) {
                        console.error('Error getting location details:', err);
                        setIsFetchingLocation(false);
                        setUsedMyLocation(false);
                    }
                },
                () => {
                    setLocError('Could not get your location');
                    setIsFetchingLocation(false);
                    setUsedMyLocation(false);
                }
            );
        } else {
            setLocError('Geolocation not supported');
            setIsFetchingLocation(false);
            setUsedMyLocation(false);
        }
    };

    if (!show) return null;

    return (
        <form id="location-switcher-form" onSubmit={handleSubmit} className="location-form">
            <div className="location_switcher__header">
                <h2 className="location_switcher__title">Change Location</h2>
                <button
                    type="button"
                    className="location_switcher__close"
                    onClick={onClose}
                    aria-label="Close location switcher"
                >
                    ✕
                </button>
            </div>
            <div className="location_switcher__content">
                <div className="location_switcher__row">
                    <div className='location_switcher__row--align'>
                        <button
                            type="button"
                            className="location_switcher__btn location_switcher__btn__my-location"
                            onClick={handleUseMyLocation}
                            aria-label="Use My Location"
                        >
                            <svg className="location_switcher__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg>
                            Use My Location
                        </button>
                    </div>
                    <div className="location_switcher__divider">OR</div>
                    <div className="location_switcher__inputs location_switcher__row--align">
                        <input
                            id="location-search"
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Enter ZIP code or city name"
                            className="location_switcher__input"
                            aria-label="Enter ZIP code or city name"
                        />
                        <small className="location_switcher__help">
                            Examples: &quot;90210&quot; or &quot;Portland, OR&quot;
                        </small>
                    </div>
                    <div className='location_switcher__row--align'>
                        <button type="submit" className="location_switcher__btn">
                            Update Location
                        </button>
                    </div>
                </div>
                {locError && <div className="error-message" role="alert">{locError}</div>}

            </div>
        </form>
    );
}
