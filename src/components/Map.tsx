import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  centers: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: string;
    status: string;
  }>;
  onCenterSelect: (centerId: string) => void;
  userLocation: { lat: number; lng: number } | null;
  isDarkMode: boolean;
}

// Fix for default marker icons in Leaflet with Vite
const DefaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const healthIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlZjQ0NDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1oZWFydCI+PHBhdGggZD0iTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTIgNS42N2wtMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OCA3Ljc4bDEuMDYgMS4wNkwxMiAyMS4yM2w3Ljc4LTcuNzgsMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAgMC03Ljc4WiIvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const shelterIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlYWI4MDgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1hbGVydC10cmlhbmdsZSI+PHBhdGggZD0ibTIxLjczIDEzLjYxLTguNDktMTQuNDhhLjgxLjgxIDAgMCAwLTEuNDggMEwyLjI3IDEzLjYxYTEuODMgMS44MyAwIDAgMCAwIDEuNzhjLjMyLjU4Ljk3Ljk0IDEuNjUuOTRoMTYuMTZjLjY4IDAgMS4zMy0uMzYgMS42NS0uOTRhMS44MyAxLjgzIDAgMCAwIDAtMS43OFoiLz48cGF0aCBkPSJNMTIgOXY0Ii8+PHBhdGggZD0iTTEyIDE3LjAxIDEyLjAxIDE3Ii8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const userIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNDI4NUY0IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaXJjbGUiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

function MapUpdater({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function Map({ centers, onCenterSelect, userLocation, isDarkMode }: MapProps) {
  const defaultCenter: LatLngExpression = userLocation 
    ? [userLocation.lat, userLocation.lng]
    : [20.5937, 78.9629]; // India's center

  const defaultZoom = userLocation ? 10 : 5;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="w-full h-[600px] rounded-lg shadow-lg"
      style={{ background: isDarkMode ? '#1a1b1e' : '#f8fafc' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={isDarkMode 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }
      />
      
      <MapUpdater center={defaultCenter} zoom={defaultZoom} />

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
            </div>
          </Popup>
        </Marker>
      )}

      {centers.map(center => (
        <Marker
          key={center.id}
          position={[center.lat, center.lng]}
          icon={center.type === 'health' ? healthIcon : shelterIcon}
          eventHandlers={{
            click: () => onCenterSelect(center.id)
          }}
        >
          <Popup>
            <div className="text-center">
              <strong>{center.name}</strong>
              <br />
              <span className="capitalize">{center.type} Center</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}