// api/weather.js
// Menggunakan format Node.js (handler) yang lebih kompatibel

export default async function handler(req, res) {
    // Parameter query sekarang ada di req.query
    const { unit = 'metric', lat, lon, q } = req.query;
    
    // Ambil API key dari Environment Variable di Vercel
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    let weatherUrl, forecastUrl;

    if (lat && lon) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
    } else if (q) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=${unit}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${q}&appid=${API_KEY}&units=${unit}`;
    } else {
        return res.status(400).json({ error: 'Location (lat/lon or q) is required' });
    }

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl),
        ]);

        if (!weatherResponse.ok) throw new Error('Location not found.');

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        const result = {
            weather: weatherData,
            forecast: forecastData,
        };
        
        // Kirim data kembali ke client menggunakan res.json()
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

