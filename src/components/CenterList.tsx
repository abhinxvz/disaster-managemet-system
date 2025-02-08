import React from 'react';
import { AlertTriangle, Heart, Phone, Globe, MapPin } from 'lucide-react';

interface Center {
  id: string;
  name: string;
  type: string;
  status: string;
  contact: string;
  website: string;
  capacity: number;
  occupancy: number;
  address: string;
  lat: number;
  lng: number;
}

interface CenterListProps {
  centers: Center[];
  selectedCenterId: string | null;
  onCenterSelect: (centerId: string) => void;
  userLocation: { lat: number; lng: number } | null;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function CenterList({ centers, selectedCenterId, onCenterSelect, userLocation }: CenterListProps) {
  const sortedCenters = React.useMemo(() => {
    if (!userLocation) return centers;

    return [...centers].sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.lat,
        a.lng
      );
      const distanceB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.lat,
        b.lng
      );
      return distanceA - distanceB;
    });
  }, [centers, userLocation]);

  return (
    <div className="overflow-y-auto h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-colors duration-200">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {userLocation ? 'Nearest Centers' : 'Available Centers'} ({centers.length})
      </h2>
      <div className="space-y-4">
        {sortedCenters.map(center => {
          const distance = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                center.lat,
                center.lng
              )
            : null;

          return (
            <div
              key={center.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedCenterId === center.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => onCenterSelect(center.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{center.name}</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  center.status === 'open' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {center.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                {center.type === 'health' ? (
                  <Heart className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span className="capitalize">{center.type} Center</span>
                {distance && (
                  <span className="ml-auto text-sm font-medium">
                    {distance.toFixed(1)} km away
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{center.address}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4" />
                <span>{center.contact}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                <Globe className="w-4 h-4" />
                <a 
                  href={`https://${center.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {center.website}
                </a>
              </div>

              <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-full rounded-full ${
                    (center.occupancy / center.capacity) > 0.9
                      ? 'bg-red-500'
                      : (center.occupancy / center.capacity) > 0.7
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${(center.occupancy / center.capacity) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Capacity: {center.occupancy}/{center.capacity}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}