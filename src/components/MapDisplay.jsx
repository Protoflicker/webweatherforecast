import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

function MapDisplay({ lat, lon, onMapClick }) {
    const mapRef = useRef(null); 
    const markerRef = useRef(null); 

    useEffect(() => {
        if (!mapRef.current) { 
            const map = L.map('map').setView([lat, lon], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const marker = L.marker([lat, lon]).addTo(map);
            
            map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                onMapClick({ lat, lon: lng });
            });
            
            mapRef.current = map;
            markerRef.current = marker;
        }
    }, [onMapClick]); 

    useEffect(() => {
        if (mapRef.current && markerRef.current) {
            mapRef.current.setView([lat, lon], 10);
            markerRef.current.setLatLng([lat, lon]);
        }
    }, [lat, lon]);

    return <div id="map"></div>;
}

export default MapDisplay;

