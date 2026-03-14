export default function ForecastDisplay({ forecast = [] }) {
  return (
    <div>
      {forecast.map((item) => (
        <p key={`${item.day}-${item.tempMax}`}>{`${item.day}: ${item.tempMax}°/${item.tempMin}°`}</p>
      ))}
    </div>
  );
}
