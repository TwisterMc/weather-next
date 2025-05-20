"use client";
import React, { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import { getLatLonFromLocation, weatherMap } from "../utils/locationUtils";
import ThreeDayForecast from "../components/ThreeDayForecast";
import LocationSwitcher from "../components/LocationSwitcher";
import Footer from "../components/Footer";
import './AppStyles.css';

export default function Home() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [temperatureC, setTemperatureC] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [condition, setCondition] = useState("");
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [feelsLike, setFeelsLike] = useState<number | null>(null);
  const [precipChance, setPrecipChance] = useState<number | null>(null);
  const [latitude, setLatitude] = useState(44.959621);
  const [longitude, setLongitude] = useState(-93.845337);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [locError, setLocError] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [usedMyLocation, setUsedMyLocation] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [pendingLocation, setPendingLocation] = useState("");
  const [lastLat, setLastLat] = useState(latitude);
  const [lastLon, setLastLon] = useState(longitude);

  useEffect(() => {
    fetchWeatherData();
    // eslint-disable-next-line
  }, [latitude, longitude]);

  function fetchWeatherData() {
    setLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability&temperature_unit=fahrenheit&timezone=America%2FChicago`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const tempF = data.current?.temperature_2m;
        setTemperature(tempF);
        if (typeof tempF === "number") {
          setTemperatureC(((tempF - 32) * 5 / 9).toFixed(1));
        } else {
          setTemperatureC(null);
        }
        setWindSpeed(data.current?.wind_speed_10m ?? null);
        setFeelsLike(data.current?.apparent_temperature ?? null);
        setPrecipChance(data.current?.precipitation_probability ?? null);
        const weatherCode = data.current?.weather_code;
        const weather = weatherMap[weatherCode] || { icon: "❓", text: "Unknown" };
        setIconUrl(weather.icon);
        setCondition(weather.text);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  function refreshWeatherData() {
    fetchWeatherData();
  }

  useEffect(() => {
    if (zip) {
      setPendingLocation(zip);
    } else if (city && state) {
      setPendingLocation(`${city}, ${state}`);
    } else {
      setPendingLocation("");
    }
  }, [zip, city, state]);

  useEffect(() => {
    if (!loading && !isFetchingLocation && (latitude !== lastLat || longitude !== lastLon)) {
      if (usedMyLocation) {
        setDisplayLocation("Your Location");
      } else {
        setDisplayLocation(pendingLocation);
      }
      setLastLat(latitude);
      setLastLon(longitude);
      setShowLocationForm(false);
    }
  }, [loading, isFetchingLocation, latitude, longitude, pendingLocation, usedMyLocation, lastLat, lastLon]);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setIsFetchingLocation(false);
        },
        () => {
          setIsFetchingLocation(false);
        }
      );
    }
  }, []);

  function getBackgroundGradient(temp: number | null) {
    if (temp === null || isNaN(temp)) {
      return "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)";
    }
    if (temp <= 0) {
      return "linear-gradient(135deg, #0a2342 0%, #274472 100%)";
    } else if (temp > 0 && temp <= 10) {
      return "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)";
    } else if (temp > 10 && temp <= 25) {
      return "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)";
    } else if (temp > 25 && temp <= 32) {
      return "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)";
    } else if (temp > 32 && temp <= 50) {
      return "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)";
    } else if (temp > 50 && temp <= 65) {
      return "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";
    } else if (temp > 65 && temp <= 80) {
      return "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)";
    } else if (temp > 80 && temp <= 90) {
      return "linear-gradient(135deg, #f7971e 0%, #f44336 100%)";
    } else if (temp > 90 && temp <= 100) {
      return "linear-gradient(135deg, #f85032 0%, #e73827 100%)";
    } else {
      return "linear-gradient(135deg, #b31217 0%, #e52d27 100%)";
    }
  }

  const backgroundGradient = getBackgroundGradient(temperature);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `The Weather For ${displayLocation || "Your Location"}`;
    }
  }, [displayLocation]);

  return (
    <div className="app-root">
      <div className="app-container">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, position: "relative", zIndex: 10 }}>
          <button
            type="button"
            className="location-toggle-btn"
            onClick={() => setShowLocationForm((v) => !v)}
            aria-expanded={showLocationForm}
            aria-controls="location-switcher-form"
            style={{ position: "relative", zIndex: 11 }}
          >
            {showLocationForm ? "Hide Location Switcher" : "Change Location"}
          </button>
          {showLocationForm && (
            <div className="location-switcher-flydown">
              <button
                type="button"
                className="location-switcher-flydown__close-btn"
                aria-label="Close Location Switcher"
                onClick={() => setShowLocationForm(false)}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="#1a5fa0" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <LocationSwitcher
                city={city}
                state={state}
                zip={zip}
                locError={locError}
                setCity={setCity}
                setState={setState}
                setZip={setZip}
                setLocError={setLocError}
                setIsFetchingLocation={setIsFetchingLocation}
                setUsedMyLocation={setUsedMyLocation}
                getLatLonFromLocation={getLatLonFromLocation}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
                show={true}
                onClose={() => setShowLocationForm(false)}
              />
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 className="app-title">
            The Weather For {displayLocation || "Your Location"}
          </h1>
        </div>
        <div
          className="weather-gradient-card"
          style={{ background: backgroundGradient }}
        >
          <div className="weather-cards-row">
            <WeatherCard
              title="US Units"
              iconUrl={iconUrl}
              condition={condition}
              temperature={temperature}
              feelsLike={feelsLike}
              wind={windSpeed}
              precipitation={precipChance}
              loading={loading || isFetchingLocation}
              error={error}
              unitSymbol="°F"
              windLabel="Wind"
              windUnit="mph"
              precipitationLabel="Precipitation"
            />
            <WeatherCard
              title="Metric Units"
              iconUrl={iconUrl}
              condition={condition}
              temperature={temperatureC}
              feelsLike={feelsLike !== null ? ((feelsLike - 32) * 5 / 9).toFixed(1) : null}
              wind={windSpeed !== null ? (windSpeed * 0.868976).toFixed(1) : null}
              precipitation={precipChance}
              loading={loading || isFetchingLocation}
              error={error}
              unitSymbol="°C"
              windLabel="Wind"
              windUnit="knots"
              precipitationLabel="Precipitation"
            />
          </div>
          <ThreeDayForecast latitude={latitude} longitude={longitude} />
        </div>
      </div>
      <section className="last-updated-row">
        <span className="last-updated-label">
          Last updated: {lastUpdated ? lastUpdated : "—"}
        </span>
        <button
          type="button"
          className="location_switcher__btn location-switcher__refresh-btn"
          onClick={refreshWeatherData}
          aria-label="Refresh weather data"
        >
          Refresh
        </button>
      </section>
      <Footer />
    </div>
  );
}
