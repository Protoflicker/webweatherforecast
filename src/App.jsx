import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MapDisplay from './components/MapDisplay';
import CurrentWeather from './components/CurrentWeather';
import ThemeToggle from './components/ThemeToggle';
import ForecastTable from './components/ForecastTable';
import SearchHistory from './components/SearchHistory';
import MessageDisplay from './components/MessageDisplay';

function App() {
    const [location, setLocation] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [unit, setUnit] = useState('metric');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('searchHistory')) || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.className = theme;
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };


    useEffect(() => {
        const initialCity = history[0] || 'Jakarta';
        setLocation(initialCity);
    }, []);

    useEffect(() => {
        if (!location) return;

        const getWeatherData = async () => {
            setLoading(true);
            setError(null);
            setCurrentWeather(null);
            setForecast(null);

            const params = new URLSearchParams({ unit });
            if (typeof location === 'string') {
                params.append('q', location);
            } else {
                params.append('lat', location.lat);
                params.append('lon', location.lon);
            }

            try {
                const response = await fetch(`/api/weather?${params.toString()}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to fetch weather data.');

                setCurrentWeather(data.weather);
                setForecast(data.forecast);
                updateSearchHistory(data.weather.name);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getWeatherData();
    }, [location, unit]);

    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }, [history]);
    
    const updateSearchHistory = (city) => {
        if (!city) return;
        setHistory(prevHistory => {
            const normalizedCity = city.toLowerCase();
            const newHistory = prevHistory.filter(item => item.toLowerCase() !== normalizedCity);
            newHistory.unshift(city);
            return newHistory.slice(0, 5);
        });
    };

    const handleClearHistory = () => {
        setHistory([]);
    };

    return (
        <>
            <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
            
            <div className={`container`}> 
                <header>
                    <h1>Weather Forecast</h1>
                </header>
                <main>
                    <section className="search-section">
                        <SearchBar
                            onSearch={setLocation}
                            onUnitChange={setUnit}
                            currentUnit={unit}
                        />
                        
                        {currentWeather && (
                             <MapDisplay 
                                lat={currentWeather.coord.lat}
                                lon={currentWeather.coord.lon}
                                onMapClick={setLocation}
                             />
                        )}
                        {currentWeather && (
                            <div className="map-disclaimer">
                                <p>
                                    Zoom on the map for more accurate location
                                </p>
                                <p>
                                    If the location shown on the weather forecast is not the one you entered or clicked it means the Weather API from OpenWeatherMap doesnt have the data for that location and is giving you the weather forecast for the nearest location
                                </p>
                            </div>
                        )}
                    </section>

                    <SearchHistory
                        history={history}
                        onHistoryClick={setLocation}
                        onClearHistory={handleClearHistory}
                    />

                    <MessageDisplay loading={loading} error={error} />
                    
                    {currentWeather && (
                        <h2 className="current-city-title">
                            Weather in {currentWeather.name}, {currentWeather.sys.country}
                        </h2>
                    )}
                    
                    <div id="weather-results" className="weather-grid">
                        <CurrentWeather data={currentWeather} unit={unit} />
                        <ForecastTable data={forecast} unit={unit} />
                    </div>

                    
                </main>
                <footer>
                    <p>123140021</p>
                </footer>
            </div>
        </>
    );
}

export default App;

