import React from 'react';

function MessageDisplay({ loading, error }) {
    return (
        <div id="message-container">
            {loading && <p className="loading">Loading data...</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default MessageDisplay;