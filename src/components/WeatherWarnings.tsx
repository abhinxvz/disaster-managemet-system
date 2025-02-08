import React from 'react';
import useSWR from 'swr';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, AlertTriangle, Loader2, ThermometerSun, Umbrella, MessageCircle } from 'lucide-react';
import { EmailSubscription } from './EmailSubscription';

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
}

interface Props {
  lat: number;
  lng: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getWeatherIcon = (code: number) => {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  if (code >= 95) return <CloudRain className="w-6 h-6 text-purple-500" />; // Thunderstorm
  if (code >= 80) return <CloudRain className="w-6 h-6 text-blue-500" />; // Rain showers
  if (code >= 71) return <CloudSnow className="w-6 h-6 text-blue-300" />; // Snow
  if (code >= 61) return <CloudRain className="w-6 h-6 text-blue-500" />; // Rain
  if (code >= 51) return <CloudRain className="w-6 h-6 text-gray-500" />; // Drizzle
  if (code >= 45) return <Cloud className="w-6 h-6 text-gray-500" />; // Foggy
  if (code >= 1) return <Cloud className="w-6 h-6 text-gray-500" />; // Partly cloudy
  return <Sun className="w-6 h-6 text-yellow-500" />; // Clear sky
};

interface RiskAssessment {
  level: 'high' | 'medium' | 'low' | null;
  type: string[];
  recommendations: string[];
}

const assessRisks = (
  weatherCode: number,
  windSpeed: number,
  temp: number,
  humidity: number,
  nextHourCodes: number[]
): RiskAssessment => {
  const risks: string[] = [];
  const recommendations: string[] = [];
  let maxLevel: 'high' | 'medium' | 'low' | null = null;

  // Temperature risks
  if (temp > 40) {
    risks.push('Extreme heat');
    recommendations.push('Stay hydrated and avoid outdoor activities');
    maxLevel = 'high';
  } else if (temp > 35) {
    risks.push('High temperature');
    recommendations.push('Limit sun exposure and drink plenty of water');
    maxLevel = maxLevel || 'medium';
  } else if (temp < 0) {
    risks.push('Freezing conditions');
    recommendations.push('Protect against frost and wear warm clothing');
    maxLevel = 'high';
  } else if (temp < 5) {
    risks.push('Cold conditions');
    recommendations.push('Wear appropriate winter clothing');
    maxLevel = maxLevel || 'medium';
  }

  // Wind risks
  if (windSpeed > 20) {
    risks.push('Strong winds');
    recommendations.push('Secure loose objects and avoid open areas');
    maxLevel = 'high';
  } else if (windSpeed > 10) {
    risks.push('Moderate winds');
    recommendations.push('Be cautious of flying debris');
    maxLevel = maxLevel || 'medium';
  }

  // Weather condition risks
  if (weatherCode >= 95 || nextHourCodes.some(code => code >= 95)) {
    risks.push('Thunderstorm');
    recommendations.push('Seek indoor shelter and avoid open areas');
    maxLevel = 'high';
  } else if (weatherCode >= 85 || nextHourCodes.some(code => code >= 85)) {
    risks.push('Heavy precipitation');
    recommendations.push('Prepare for potential flooding');
    maxLevel = 'high';
  } else if (weatherCode >= 71) {
    risks.push('Snow conditions');
    recommendations.push('Check road conditions before travel');
    maxLevel = maxLevel || 'medium';
  } else if (weatherCode >= 61) {
    risks.push('Rainy conditions');
    recommendations.push('Carry rain protection');
    maxLevel = maxLevel || 'low';
  }

  // Humidity-related risks
  if (humidity > 85 && temp > 30) {
    risks.push('High humidity heat');
    recommendations.push('Avoid strenuous activities');
    maxLevel = maxLevel || 'medium';
  }

  return {
    level: maxLevel,
    type: risks,
    recommendations: recommendations
  };
};

const getWeatherDescription = (code: number): string => {
  if (code >= 95) return 'Thunderstorm';
  if (code >= 85) return 'Snow showers';
  if (code >= 80) return 'Rain showers';
  if (code >= 71) return 'Snow';
  if (code >= 61) return 'Rain';
  if (code >= 51) return 'Drizzle';
  if (code >= 45) return 'Foggy';
  if (code >= 1) return 'Partly cloudy';
  return 'Clear sky';
};

const getWeatherMessage = (risks: RiskAssessment): string => {
  if (!risks.level) return "Weather conditions are currently stable. No special precautions needed.";

  if (risks.level === 'high') {
    return "EMERGENCY ALERT: Dangerous weather conditions detected. Please take immediate precautions and stay informed about evacuation notices. Follow all safety recommendations and be prepared to move to the nearest shelter if advised.";
  }

  if (risks.level === 'medium') {
    return "WEATHER ADVISORY: Potentially hazardous conditions observed. Monitor local updates and review your emergency plans. Consider postponing non-essential travel and stay prepared for possible weather changes.";
  }

  return "WEATHER NOTICE: Minor weather concerns present. Stay aware of changing conditions and follow basic safety guidelines. Check updates before planning outdoor activities.";
};

export function WeatherWarnings({ lat, lng }: Props) {
  const { data, error, isLoading } = useSWR<WeatherData>(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,wind_speed_10m&forecast_hours=3`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">Failed to load weather data</p>
      </div>
    );
  }

  const nextHourCodes = data.hourly.weather_code.slice(0, 3);
  const risks = assessRisks(
    data.current.weather_code,
    data.current.wind_speed_10m,
    data.current.temperature_2m,
    data.current.relative_humidity_2m,
    nextHourCodes
  );

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 shadow-inner transition-colors duration-200">
      {/* Weather Message Section */}
      <div className={`mb-4 p-4 rounded-lg border-l-4 ${
        risks.level === 'high'
          ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
          : risks.level === 'medium'
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
          : risks.level === 'low'
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
          : 'bg-gray-50 dark:bg-gray-800/30 border-gray-500'
      }`}>
        <div className="flex items-start gap-3">
          <MessageCircle className={`w-6 h-6 mt-1 ${
            risks.level === 'high'
              ? 'text-red-500'
              : risks.level === 'medium'
              ? 'text-yellow-500'
              : risks.level === 'low'
              ? 'text-blue-500'
              : 'text-gray-500'
          }`} />
          <div>
            <h3 className={`font-semibold mb-1 ${
              risks.level === 'high'
                ? 'text-red-700 dark:text-red-300'
                : risks.level === 'medium'
                ? 'text-yellow-700 dark:text-yellow-300'
                : risks.level === 'low'
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              Weather Alert Message
            </h3>
            <p className={`text-sm ${
              risks.level === 'high'
                ? 'text-red-600 dark:text-red-200'
                : risks.level === 'medium'
                ? 'text-yellow-600 dark:text-yellow-200'
                : risks.level === 'low'
                ? 'text-blue-600 dark:text-blue-200'
                : 'text-gray-600 dark:text-gray-200'
            }`}>
              {getWeatherMessage(risks)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getWeatherIcon(data.current.weather_code)}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Weather</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{getWeatherDescription(data.current.weather_code)}</p>
          </div>
        </div>
        {risks.level && (
          <div className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm ${
            risks.level === 'high' 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              : risks.level === 'medium'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          }`}>
            <AlertTriangle className="w-4 h-4" />
            <span className="capitalize">{risks.level} Risk</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/50 dark:bg-white/5 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <ThermometerSun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{Math.round(data.current.temperature_2m)}°C</p>
        </div>
        <div className="bg-white/50 dark:bg-white/5 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <ThermometerSun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Feels Like</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{Math.round(data.current.apparent_temperature)}°C</p>
        </div>
        <div className="bg-white/50 dark:bg-white/5 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Umbrella className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{data.current.relative_humidity_2m}%</p>
        </div>
        <div className="bg-white/50 dark:bg-white/5 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{Math.round(data.current.wind_speed_10m)} km/h</p>
        </div>
      </div>

      {risks.level && (
        <div className="mt-4 space-y-4">
          {/* Risk Assessment Section */}
          <div className={`p-4 rounded-lg ${
            risks.level === 'high'
              ? 'bg-red-100 dark:bg-red-900/30'
              : risks.level === 'medium'
              ? 'bg-yellow-100 dark:bg-yellow-900/30'
              : 'bg-blue-100 dark:bg-blue-900/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-5 h-5 ${
                risks.level === 'high'
                  ? 'text-red-700 dark:text-red-300'
                  : risks.level === 'medium'
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`} />
              <h4 className={`font-semibold ${
                risks.level === 'high'
                  ? 'text-red-700 dark:text-red-300'
                  : risks.level === 'medium'
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>Current Risks</h4>
            </div>
            
            <div className="space-y-2">
              <div className={`text-sm ${
                risks.level === 'high'
                  ? 'text-red-700 dark:text-red-300'
                  : risks.level === 'medium'
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                <strong>Identified Risks:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {risks.type.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>
              
              <div className={`text-sm ${
                risks.level === 'high'
                  ? 'text-red-700 dark:text-red-300'
                  : risks.level === 'medium'
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                <strong>Safety Recommendations:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {risks.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}