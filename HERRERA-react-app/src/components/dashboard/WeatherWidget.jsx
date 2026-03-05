export default function WeatherWidget({ weather }) {
  return (
    <article className="weather-card glass-card">
      <div className="section-title-row">
        <h3>{weather.city}</h3>
        <p>Live weather for campus operations</p>
      </div>
      <div className="weather-main">
        <div>
          <strong>{weather.currentTemp}°C</strong>
          <span>{weather.summary}</span>
        </div>
      </div>
      <div className="forecast-grid">
        {weather.forecast.map((item) => (
          <div key={item.day} className="forecast-tile">
            <p>{item.day}</p>
            <strong>{item.tempMax}°</strong>
            <span>Rain {item.rainChance}%</span>
          </div>
        ))}
      </div>
    </article>
  );
}
