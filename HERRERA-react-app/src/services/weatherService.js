import { fallbackWeather } from "../data/mockData";

const WEATHER_CODE_TEXT = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  80: "Rain showers",
  95: "Thunderstorm",
};

const dayLabel = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", { weekday: "short" });

export async function getCampusWeather() {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=7.4478&longitude=125.8078&current=temperature_2m,weather_code&daily=temperature_2m_max,precipitation_probability_max&timezone=Asia%2FManila&forecast_days=4";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Weather API request failed");
    }
    const payload = await response.json();

    return {
      city: "Tagum City",
      currentTemp: Math.round(payload.current.temperature_2m),
      summary: WEATHER_CODE_TEXT[payload.current.weather_code] || "Variable weather",
      forecast: payload.daily.time.map((time, index) => ({
        day: dayLabel(time),
        tempMax: Math.round(payload.daily.temperature_2m_max[index]),
        rainChance: payload.daily.precipitation_probability_max[index] || 0,
      })),
    };
  } catch {
    return fallbackWeather;
  }
}
