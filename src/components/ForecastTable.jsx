import React from 'react';

function ForecastTable({ data, unit }) {
    if (!data) return null;

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    const tempUnit = unit === 'metric' ? '°C' : '°F';

    return (
        <section id="forecast-container" aria-live="polite">
            <h3>5-Day Forecast</h3>
            <table className="forecast-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp</th>
                        <th>Weather</th>
                    </tr>
                </thead>
                <tbody>
                    {dailyForecasts.map(day => {
                        const date = new Date(day.dt_txt);
                        const formattedDate = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
                        return (
                            <tr key={day.dt}>
                                <td>{formattedDate}</td>
                                <td>{Math.round(day.main.temp)}{tempUnit}</td>
                                <td>{day.weather[0].main}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}

export default ForecastTable;