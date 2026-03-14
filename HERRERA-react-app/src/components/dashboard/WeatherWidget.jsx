import {
  Cloud,
  CloudRain,
  Droplets,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Search,
  Sun,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fallbackWeather } from "../../data/mockData";
import { fetchWeatherByCity, fetchWeatherByCoords } from "../../services/weatherService";
import { sanitizeTextInput } from "../../utils/security";

function WeatherIcon({ icon, size = 22 }) {
  if (icon === "sun") return <Sun size={size} />;
  if (icon === "rain") return <CloudRain size={size} />;
  return <Cloud size={size} />;
}

function getErrorMessage(error) {
  if (error?.code === "RATE_LIMITED") {
    return "Weather API rate limit reached. Showing fallback data for now.";
  }
  if (error?.code === "CITY_NOT_FOUND") {
    return "City not found. Try another location name.";
  }
  return "Unable to load live weather. Showing fallback forecast.";
}

function formatDateTime() {
  const now = new Date();

  return {
    cityDate: now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function WeatherWidget() {
  const [query, setQuery] = useState("Tagum City");
  const [weather, setWeather] = useState(fallbackWeather);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [clock, setClock] = useState(formatDateTime());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const dateInputRef = useRef(null);

  const loadCityWeather = async (cityName) => {
    setIsLoading(true);
    setMessage("");

    try {
      const nextWeather = await fetchWeatherByCity(cityName);
      setWeather(nextWeather);
    } catch (error) {
      setWeather(fallbackWeather);
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCityWeather("Tagum City");
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(formatDateTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loadCityWeather(sanitizeTextInput(query));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported in this browser.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const nextWeather = await fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setWeather(nextWeather);
        } catch (error) {
          setWeather(fallbackWeather);
          setMessage(getErrorMessage(error));
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setIsLoading(false);
        setMessage("Location access denied. Search by city instead.");
      }
    );
  };

  const handleDateClick = () => {
    const dateInput = dateInputRef.current;
    if (!dateInput) {
      return;
    }

    if (typeof dateInput.showPicker === "function") {
      dateInput.showPicker();
      return;
    }

    dateInput.focus();
    dateInput.click();
  };

  return (
    <article className="weather-card weather-showcase glass-card">
      <div className="weather-showcase-panel">
        <div className="weather-topline">
          <span className="weather-city-chip">{weather.city}</span>
          <span className="weather-wind-chip">
            <Wind size={13} />
            {weather.windSpeed} km/h
          </span>
        </div>

        <div className="weather-hero-grid">
          <div className="weather-hero-copy">
            <button
              type="button"
              className="weather-date-label weather-date-trigger"
              onClick={handleDateClick}
              aria-label="Open calendar"
              title="Open calendar"
            >
              {clock.cityDate}
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="weather-hidden-date-input"
              tabIndex={-1}
              aria-hidden="true"
            />
            <div className="weather-big-time">{clock.time}</div>
            <div className="weather-stat-row">
              <span>
                <Droplets size={13} />
                {weather.humidity}%
              </span>
              <span>
                <Wind size={13} />
                {weather.windSpeed} km/h
              </span>
            </div>
            <div className="weather-extra-lines">
              <p>Sunrise 05:55AM</p>
              <p>Sunset 06:35PM</p>
            </div>
          </div>

          <div className="weather-hero-visual">
            <div className="weather-sun-glow" />
            <div className="weather-main-icon">
              {isLoading ? (
                <LoaderCircle size={72} className="spin" />
              ) : (
                <WeatherIcon icon={weather.icon} size={72} />
              )}
            </div>
            <div className="weather-temp-block">
              <strong>{weather.currentTemp}°C</strong>
              <span>{weather.summary}</span>
              <small>Feels like {weather.currentTemp}°C</small>
            </div>
          </div>
        </div>

        <form className="weather-search weather-search-overlay" onSubmit={handleSubmit}>
          <div className="weather-search-input">
            <Search size={16} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search city name"
            />
          </div>
          <button type="submit" className="ghost-btn">
            Search
          </button>
          <button type="button" className="ghost-btn" onClick={handleUseLocation}>
            <LocateFixed size={15} />
          </button>
        </form>

        {message ? <p className="weather-message">{message}</p> : null}

        <div className="forecast-grid weather-forecast-strip">
          {weather.forecast.map((item) => (
            <div key={item.day} className="forecast-tile">
              <p>{item.day}</p>
              <div className="forecast-icon-row">
                <WeatherIcon icon={item.icon} size={22} />
              </div>
              <strong>
                {item.tempMax}° / {item.tempMin}°
              </strong>
              <span>Rain {item.rainChance}%</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
