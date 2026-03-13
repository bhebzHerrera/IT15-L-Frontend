import { fallbackWeather } from "../data/mockData";

const WEATHER_CODE_MAP = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mainly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Fog", icon: "cloud" },
  51: { label: "Light drizzle", icon: "rain" },
  61: { label: "Light rain", icon: "rain" },
  63: { label: "Moderate rain", icon: "rain" },
  65: { label: "Heavy rain", icon: "rain" },
  80: { label: "Rain showers", icon: "rain" },
  95: { label: "Thunderstorm", icon: "storm" },
};

function getWeatherDescriptor(code) {
  return WEATHER_CODE_MAP[code] || { label: "Variable weather", icon: "cloud" };
}

function formatDay(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", { weekday: "short" });
}

function mapWeatherResponse(payload, cityName) {
  const currentDescriptor = getWeatherDescriptor(payload.current.weather_code);

  return {
    city: cityName,
    currentTemp: Math.round(payload.current.temperature_2m),
    humidity: payload.current.relative_humidity_2m ?? fallbackWeather.humidity,
    windSpeed: Math.round(payload.current.wind_speed_10m ?? fallbackWeather.windSpeed),
    summary: currentDescriptor.label,
    icon: currentDescriptor.icon,
    forecast: payload.daily.time.slice(0, 5).map((time, index) => {
      const dailyDescriptor = getWeatherDescriptor(payload.daily.weather_code[index]);

      return {
        day: formatDay(time),
        tempMax: Math.round(payload.daily.temperature_2m_max[index]),
        tempMin: Math.round(payload.daily.temperature_2m_min[index]),
        rainChance: payload.daily.precipitation_probability_max[index] || 0,
        icon: dailyDescriptor.icon,
      };
    }),
  };
}

async function fetchForecast(latitude, longitude, cityName) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=auto&forecast_days=5";

  const response = await fetch(url);

  if (response.status === 429) {
    const rateLimitError = new Error("rate_limited");
    rateLimitError.code = "RATE_LIMITED";
    throw rateLimitError;
  }

  if (!response.ok) {
    throw new Error("Weather forecast request failed");
  }

  const payload = await response.json();
  return mapWeatherResponse(payload, cityName);
}

export async function fetchWeatherByCity(cityName) {
  const trimmedCity = cityName.trim();
  if (!trimmedCity) {
    return fallbackWeather;
  }

  try {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmedCity
    )}&count=1&language=en&format=json`;
    const geocodeResponse = await fetch(geocodeUrl);

    if (geocodeResponse.status === 429) {
      const rateLimitError = new Error("rate_limited");
      rateLimitError.code = "RATE_LIMITED";
      throw rateLimitError;
    }

    if (!geocodeResponse.ok) {
      throw new Error("City lookup failed");
    }

    const geocodePayload = await geocodeResponse.json();
    const place = geocodePayload.results?.[0];

    if (!place) {
      const notFoundError = new Error("city_not_found");
      notFoundError.code = "CITY_NOT_FOUND";
      throw notFoundError;
    }

    const resolvedName = [place.name, place.country].filter(Boolean).join(", ");
    return await fetchForecast(place.latitude, place.longitude, resolvedName);
  } catch (error) {
    if (error.code) {
      throw error;
    }
    throw new Error("WEATHER_FETCH_FAILED");
  }
}

export async function fetchWeatherByCoords(latitude, longitude) {
  try {
    return await fetchForecast(latitude, longitude, "Current Location");
  } catch (error) {
    if (error.code) {
      throw error;
    }
    throw new Error("WEATHER_FETCH_FAILED");
  }
}
