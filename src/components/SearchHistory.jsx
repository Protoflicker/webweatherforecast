import React from 'react';

function SearchHistory({ history, onHistoryClick, onClearHistory }) {
    if (history.length === 0) return null;

    return (
        <section id="history-container" className="history-section">
            <h4>Search History</h4>
            <div className="history-tags">
                {history.map(city => (
                    <button
                        key={city}
                        className="history-tag"
                        onClick={() => onHistoryClick(city)}
                    >
                        {city}
                    </button>
                ))}
            </div>
            <button className="clear-history-btn" onClick={onClearHistory}>
                Clear History
            </button>
        </section>
    );
}

export default SearchHistory;