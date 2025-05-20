"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { weatherMap } from "@/utils/locationUtils";

interface WeatherContextType {
  temperature: number | null;
  temperatureC: string | null;
  loading: boolean;
  error: string | null;
  iconUrl: string | React.ReactNode | null;
  condition: string;
  windSpeed: number | null;
  feelsLike: number | null;
  precipChance: number | null;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zip: string;
  locError: string;
  displayLocation: string;
  isFetchingLocation: boolean;
  usedMyLocation: boolean;
  showLocationForm: boolean;
  lastUpdated: string | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lon: number) => void;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setZip: (zip: string) => void;
  setShowLocationForm: (show: boolean) => void;
  refreshWeatherData: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within a WeatherProvider");
  return ctx;
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [temperatureC, setTemperatureC] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | React.ReactNode | null>(null);
  const [condition, setCondition] = useState("");
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [feelsLike, setFeelsLike] = useState<number | null>(null);
  const [precipChance, setPrecipChance] = useState<number | null>(null);
  const [latitude, setLatitude] = useState(44.959621);
  const [longitude, setLongitude] = useState(-93.845337);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [locError] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [usedMyLocation] = useState(false);
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

  return (
    <WeatherContext.Provider
      value={{
        temperature,
        temperatureC,
        loading,
        error,
        iconUrl,
        condition,
        windSpeed,
        feelsLike,
        precipChance,
        latitude,
        longitude,
        city,
        state,
        zip,
        locError,
        displayLocation,
        isFetchingLocation,
        usedMyLocation,
        showLocationForm,
        lastUpdated,
        setLatitude,
        setLongitude,
        setCity,
        setState,
        setZip,
        setShowLocationForm,
        refreshWeatherData,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
