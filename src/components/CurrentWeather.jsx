import React from 'react';

function CurrentWeather({ data, unit }) {
    if (!data) return null;

    const { name, main, weather, wind } = data;
    const tempUnit = unit === 'metric' ? '°C' : '°F';
    const windUnit = unit === 'metric' ? 'm/s' : 'mph';

    return (
        <section id="current-weather-container" aria-live="polite">
            <h3>Current Weather in {name}</h3>
            <img src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} alt={weather[0].description} />
            <p className="current-temp">{Math.round(main.temp)}{tempUnit}</p>
            <p className="current-desc">{weather[0].main} ({weather[0].description})</p>
            <div className="current-details">
                <p><strong>Humidity:</strong> {main.humidity}%</p>
                <p><strong>Wind:</strong> {wind.speed.toFixed(1)} {windUnit}</p>
            </div>
        </section>
    );
}

export default CurrentWeather;