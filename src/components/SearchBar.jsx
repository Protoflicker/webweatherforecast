import React, { useState, useEffect, useRef } from 'react';

function SearchBar({ query, onQueryChange, onSearch, onUnitChange, currentUnit }) {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    
    const debounceTimeoutRef = useRef(null);
    const searchBarRef = useRef(null);

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        debounceTimeoutRef.current = setTimeout(async () => {
            setIsLoadingSuggestions(true);
            setSuggestions([]);
            try {
                const response = await fetch(`/api/geo?q=${query}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to fetch suggestions.');
                
                const formattedSuggestions = data.map(city => ({
                    ...city,
                    fullName: [city.name, city.state, city.country].filter(Boolean).join(', ')
                }));
                setSuggestions(formattedSuggestions);
            } catch (error) {
                console.error("Suggestion fetch error:", error);
                setSuggestions([]);
            } finally {
                setIsLoadingSuggestions(false);
            }
        }, 500); 
        return () => {
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        };
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchBarRef]);

    const handleSuggestionClick = (city) => {
        onSearch({ lat: city.lat, lon: city.lon });
        setSuggestions([]); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query) {
            onSearch(query);
            setSuggestions([]); 
        }
    };

    return (
        <div ref={searchBarRef}>
            <form id="search-form" onSubmit={handleSubmit}>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        id="city-input"
                        placeholder="Enter city name..."
                        autoComplete="off"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                    />
                    {(suggestions.length > 0 || isLoadingSuggestions) && query.length >= 3 && (
                        <div id="suggestions-container">
                            {isLoadingSuggestions && <div className="suggestion-item-info">Loading...</div>}
                            {!isLoadingSuggestions && suggestions.length === 0 && <div className="suggestion-item-info">No results found.</div>}
                            {suggestions.map((city, index) => (
                                <div
                                    key={`${city.lat}-${city.lon}-${index}`}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(city)}
                                >
                                    {city.fullName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit">Search</button>
                <fieldset className="unit-toggle">
                    <legend className="sr-only">Temperature Unit</legend>
                    <label>
                        <input type="radio" name="unit" value="metric" checked={currentUnit === 'metric'} onChange={(e) => onUnitChange(e.target.value)} /> °C
                    </label>
                    <label>
                        <input type="radio" name="unit" value="imperial" checked={currentUnit === 'imperial'} onChange={(e) => onUnitChange(e.target.value)} /> °F
                    </label>
                </fieldset>
            </form>
        </div>
    );
}

export default SearchBar;