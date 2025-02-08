import React from 'react';
import { Phone, MapPin, AlertTriangle } from 'lucide-react';

interface Center {
  id: string;
  name: string;
  type: string;
  contact: string;
  address: string;
  capacity: number;
  occupancy: number;
}

interface MinimalViewProps {
  centers: Center[];
  onClose: () => void;
}

export function MinimalView({ centers, onClose }: MinimalViewProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Response Centers</h1>
          <button
            onClick={onClose}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Switch to Full View
          </button>
        </div>

        {/* Static Weather Warning Section */}
        <div className="mb-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-red-700 dark:text-red-300">Active Weather Warnings</h2>
          </div>
          <p className="text-sm text-red-600 dark:text-red-200">
            For your safety, please check local weather updates and follow official guidance. 
            Switch to full view for detailed weather information.
          </p>
          <div className="mt-2 text-sm text-red-600 dark:text-red-200">
            Emergency Contacts:
            <ul className="mt-1 ml-4 list-disc">
              <li>National Emergency: 112</li>
              <li>Disaster Management: 011-26701700</li>
              <li>Medical Emergency: 102</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {centers.map(center => (
            <div
              key={center.id}
              className="border-b dark:border-gray-700 pb-4 text-sm"
            >
              <div className="font-medium text-gray-900 dark:text-white">{center.name}</div>
              <div className="mt-1 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <a href={`tel:${center.contact}`} className="hover:underline">{center.contact}</a>
              </div>
              <div className="mt-1 flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>{center.address}</span>
              </div>
              <div className="mt-1 text-gray-600 dark:text-gray-400">
                Available: {center.capacity - center.occupancy} spots
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            You're viewing the minimal version optimized for low network connectivity. 
            Some features like maps and real-time updates are disabled.
          </p>
        </div>
      </div>
    </div>
  );
}