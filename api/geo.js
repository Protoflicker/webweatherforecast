export default async function handler(req, res) {
    const { q } = req.query;
    
 
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch suggestions from OpenWeatherMap');
        }

        const data = await response.json();
        
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}