import React, { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { CenterList } from './components/CenterList';
import { Stats } from './components/Stats';
import { WeatherWarnings } from './components/WeatherWarnings';
import { FAQChatbot } from './components/FAQChatbot';
import { MinimalView } from './components/MinimalView';
import { AlertTriangle, Heart, MapPin, Quote, Moon, Sun, Wifi, WifiOff } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { EmailSubscription } from './components/EmailSubscription';

// Comprehensive list of disaster management centers
const initialCenters = [
  {
    id: '1',
    name: 'National Disaster Management Authority (NDMA)',
    type: 'health',
    status: 'open',
    contact: '011-26701700',
    website: 'ndma.gov.in',
    capacity: 1000,
    occupancy: 450,
    lat: 28.5792,
    lng: 77.2099,
    address: 'NDMA Bhawan, A-1, Safdarjung Enclave, New Delhi - 110029'
  },
  {
    id: '2',
    name: 'National Institute of Disaster Management (NIDM)',
    type: 'shelter',
    status: 'open',
    contact: '011-23438293',
    website: 'nidm.gov.in',
    capacity: 800,
    occupancy: 320,
    lat: 28.7197,
    lng: 77.1158,
    address: 'Plot No. 15, Pocket-3, Block-B, Sector-29, Rohini, Delhi - 110042'
  },
  {
    id: '3',
    name: 'National Disaster Response Force (NDRF)',
    type: 'health',
    status: 'open',
    contact: '011-24363260',
    website: 'ndrf.gov.in',
    capacity: 1200,
    occupancy: 580,
    lat: 28.6129,
    lng: 77.2295,
    address: '6th Floor, NDCC-II Building, Jai Singh Road, New Delhi - 110001'
  },
  {
    id: '4',
    name: 'Indian Red Cross Society',
    type: 'health',
    status: 'open',
    contact: '011-23716441',
    website: 'indianredcross.org',
    capacity: 500,
    occupancy: 280,
    lat: 28.6304,
    lng: 77.2177,
    address: '1 Red Cross Road, New Delhi - 110001'
  },
  {
    id: '5',
    name: 'SEEDS India',
    type: 'shelter',
    status: 'open',
    contact: '011-26174272',
    website: 'seedsindia.org',
    capacity: 600,
    occupancy: 410,
    lat: 28.5691,
    lng: 77.1866,
    address: '15-A, Institutional Area, R.K. Puram, Sector-4, New Delhi - 110022'
  },
  {
    id: '6',
    name: 'All India Disaster Mitigation Institute',
    type: 'health',
    status: 'open',
    contact: '079-26586234',
    website: 'aidmi.org',
    capacity: 400,
    occupancy: 180,
    lat: 23.0225,
    lng: 72.5714,
    address: '411, Sakar Five, Near Nataraj Cinema, Ashram Road, Ahmedabad, Gujarat - 380009'
  },
  {
    id: '7',
    name: 'Goonj',
    type: 'shelter',
    status: 'open',
    contact: '011-26972351',
    website: 'goonj.org',
    capacity: 700,
    occupancy: 520,
    lat: 28.5298,
    lng: 77.2897,
    address: 'J-93, Sarita Vihar, New Delhi - 110076'
  },
  {
    id: '8',
    name: 'Sphere India',
    type: 'shelter',
    status: 'open',
    contact: '011-23731230',
    website: 'sphereindia.org.in',
    capacity: 450,
    occupancy: 290,
    lat: 28.6420,
    lng: 77.1779,
    address: 'C/o CASA, Rachna Building, 2 Rajendra Place, New Delhi - 110008'
  },
  {
    id: '9',
    name: 'Caritas India',
    type: 'health',
    status: 'open',
    contact: '011-23363390',
    website: 'caritasindia.org',
    capacity: 550,
    occupancy: 380,
    lat: 28.6336,
    lng: 77.2189,
    address: 'CBCI Centre, 1 Ashok Place, New Delhi - 110001'
  },
  {
    id: '10',
    name: 'Oxfam India',
    type: 'shelter',
    status: 'open',
    contact: '011-46538000',
    website: 'oxfamindia.org',
    capacity: 800,
    occupancy: 560,
    lat: 28.6289,
    lng: 77.2195,
    address: '4th Floor, Shriram Bharatiya Kala Kendra, New Delhi - 110001'
  },
  {
    id: '11',
    name: 'Save the Children India',
    type: 'health',
    status: 'open',
    contact: '011-42294900',
    website: 'savethechildren.in',
    capacity: 600,
    occupancy: 420,
    lat: 28.5483,
    lng: 77.2512,
    address: '3rd Floor, Vardhaman Trade Center, Nehru Place, New Delhi - 110019'
  },
  {
    id: '12',
    name: 'Plan India',
    type: 'shelter',
    status: 'open',
    contact: '011-46558484',
    website: 'planindia.org',
    capacity: 500,
    occupancy: 350,
    lat: 28.5534,
    lng: 77.2566,
    address: 'E-12, Kailash Colony, New Delhi - 110048'
  },
  {
    id: '13',
    name: 'CARE India',
    type: 'health',
    status: 'open',
    contact: '0120-4048250',
    website: 'careindia.org',
    capacity: 700,
    occupancy: 480,
    lat: 28.5355,
    lng: 77.3910,
    address: 'A-12, Bhilwara Towers, Sector 1, Noida - 201301'
  },
  {
    id: '14',
    name: 'ActionAid India',
    type: 'shelter',
    status: 'open',
    contact: '011-40640500',
    website: 'actionaidindia.org',
    capacity: 450,
    occupancy: 300,
    lat: 28.5494,
    lng: 77.2001,
    address: 'R-7, Hauz Khas Enclave, New Delhi - 110016'
  },
  {
    id: '15',
    name: 'Prayas Juvenile Aid Centre',
    type: 'shelter',
    status: 'open',
    contact: '011-29955505',
    website: 'prayaschildren.org',
    capacity: 300,
    occupancy: 180,
    lat: 28.5138,
    lng: 77.2090,
    address: '59, Tughlakabad Institutional Area, New Delhi - 110062'
  },
  {
    id: '16',
    name: 'Bhumi',
    type: 'shelter',
    status: 'open',
    contact: '044-66469878',
    website: 'bhumi.ngo',
    capacity: 400,
    occupancy: 250,
    lat: 12.9908,
    lng: 80.2429,
    address: '10th Floor, IIT Madras Research Park, Chennai - 600113'
  },
  {
    id: '17',
    name: 'United Way Mumbai',
    type: 'health',
    status: 'open',
    contact: '022-24937676',
    website: 'unitedwaymumbai.org',
    capacity: 600,
    occupancy: 420,
    lat: 18.9692,
    lng: 72.8169,
    address: '309, Nirman Kendra, Dr. E. Moses Road, Mumbai - 400011'
  },
  {
    id: '18',
    name: 'Rapid Response',
    type: 'health',
    status: 'open',
    contact: '080-41466684',
    website: 'rapidresponse.org.in',
    capacity: 500,
    occupancy: 320,
    lat: 12.9784,
    lng: 77.6408,
    address: 'No. 6, 2nd Floor, Indiranagar, Bengaluru - 560038'
  },
  {
    id: '19',
    name: 'Doctors For You',
    type: 'health',
    status: 'open',
    contact: '011-41558080',
    website: 'doctorsforyou.org',
    capacity: 400,
    occupancy: 280,
    lat: 28.5883,
    lng: 77.2407,
    address: 'A-13, First Floor, Nizamuddin West, New Delhi - 110013'
  },
  {
    id: '20',
    name: 'ChildFund India',
    type: 'shelter',
    status: 'open',
    contact: '080-25633420',
    website: 'childfundindia.org',
    capacity: 350,
    occupancy: 230,
    lat: 12.9716,
    lng: 77.5946,
    address: 'No. 22, Museum Road, Bangalore - 560001'
  },
  {
    id: '21',
    name: 'HelpAge India',
    type: 'health',
    status: 'open',
    contact: '011-41688955',
    website: 'helpageindia.org',
    capacity: 450,
    occupancy: 280,
    lat: 28.5398,
    lng: 77.1868,
    address: 'C-14, Qutab Institutional Area, New Delhi - 110016'
  },
  {
    id: '22',
    name: 'Smile Foundation',
    type: 'shelter',
    status: 'open',
    contact: '011-43123700',
    website: 'smilefoundationindia.org',
    capacity: 400,
    occupancy: 260,
    lat: 28.5679,
    lng: 77.2432,
    address: 'L-1, Jangpura Extension, New Delhi - 110014'
  },
  {
    id: '23',
    name: 'The Akshaya Patra Foundation',
    type: 'shelter',
    status: 'open',
    contact: '080-30143400',
    website: 'akshayapatra.org',
    capacity: 800,
    occupancy: 620,
    lat: 12.9850,
    lng: 77.5533,
    address: 'H.K. Hill, Chord Road, Bangalore - 560010'
  },
  {
    id: '24',
    name: 'Disaster Management Institute',
    type: 'health',
    status: 'open',
    contact: '0755-2466715',
    website: 'dmi.mp.gov.in',
    capacity: 500,
    occupancy: 320,
    lat: 23.2599,
    lng: 77.4126,
    address: 'Paryavaran Parisar, E-5, Arera Colony, Bhopal - 462016'
  },
  {
    id: '25',
    name: 'YASHADA',
    type: 'shelter',
    status: 'open',
    contact: '020-25608000',
    website: 'yashada.org',
    capacity: 600,
    occupancy: 420,
    lat: 18.5204,
    lng: 73.8567,
    address: 'Raj Bhavan Complex, Baner Road, Pune - 411007'
  },
  {
    id: '26',
    name: 'District Disaster Management Authority (DDMA) - Uttarkashi',
    type: 'health',
    status: 'open',
    contact: '01374-222722',
    website: 'uttarkashi.nic.in/disaster-management',
    capacity: 500,
    occupancy: 200,
    lat: 30.7268,
    lng: 78.4354,
    address: 'District Collectorate, Uttarkashi - 249193, Uttarakhand'
  },
  {
    id: '27',
    name: 'District Disaster Management Authority (DDMA) - Chamoli',
    type: 'health',
    status: 'open',
    contact: '01372-252134',
    website: 'chamoli.nic.in/disaster-management',
    capacity: 450,
    occupancy: 180,
    lat: 30.4059,
    lng: 79.3240,
    address: 'District Collectorate, Gopeshwar, Chamoli - 246401, Uttarakhand'
  },
  {
    id: '28',
    name: 'District Disaster Management Authority (DDMA) - Rudraprayag',
    type: 'health',
    status: 'open',
    contact: '01364-233727',
    website: 'rudraprayag.nic.in/disaster-management',
    capacity: 400,
    occupancy: 150,
    lat: 30.2844,
    lng: 78.9811,
    address: 'District Collectorate, Rudraprayag - 246171, Uttarakhand'
  },
  {
    id: '29',
    name: 'District Disaster Management Authority (DDMA) - Pithoragarh',
    type: 'health',
    status: 'open',
    contact: '05964-225425',
    website: 'pithoragarh.nic.in/disaster-management',
    capacity: 350,
    occupancy: 140,
    lat: 29.5828,
    lng: 80.2181,
    address: 'District Collectorate, Pithoragarh - 262501, Uttarakhand'
  },
  {
    id: '30',
    name: 'District Disaster Management Authority (DDMA) - Nainital',
    type: 'health',
    status: 'open',
    contact: '05942-231178',
    website: 'nainital.nic.in/disaster-management',
    capacity: 600,
    occupancy: 250,
    lat: 29.3919,
    lng: 79.4542,
    address: 'District Collectorate, Nainital - 263001, Uttarakhand'
  },
  {
    id: '31',
    name: 'District Disaster Management Authority (DDMA) - Dehradun',
    type: 'health',
    status: 'open',
    contact: '0135-2726066',
    website: 'dehradun.nic.in/disaster-management',
    capacity: 800,
    occupancy: 400,
    lat: 30.3165,
    lng: 78.0322,
    address: 'District Collectorate, Dehradun - 248001, Uttarakhand'
  },
  {
    id: '32',
    name: 'District Disaster Management Authority (DDMA) - Haridwar',
    type: 'health',
    status: 'open',
    contact: '01334-239431',
    website: 'haridwar.nic.in/disaster-management',
    capacity: 700,
    occupancy: 350,
    lat: 29.9457,
    lng: 78.1642,
    address: 'District Collectorate, Roshnabad, Haridwar - 249403, Uttarakhand'
  },
  {
    id: '33',
    name: 'District Disaster Management Authority (DDMA) - Almora',
    type: 'health',
    status: 'open',
    contact: '05962-230731',
    website: 'almora.nic.in/disaster-management',
    capacity: 400,
    occupancy: 160,
    lat: 29.5892,
    lng: 79.6467,
    address: 'District Collectorate, Almora - 263601, Uttarakhand'
  },
  {
    id: '34',
    name: 'District Disaster Management Authority (DDMA) - Bageshwar',
    type: 'health',
    status: 'open',
    contact: '05963-220001',
    website: 'bageshwar.nic.in/disaster-management',
    capacity: 300,
    occupancy: 120,
    lat: 29.8362,
    lng: 79.7707,
    address: 'District Collectorate, Bageshwar - 263642, Uttarakhand'
  },
  {
    id: '35',
    name: 'District Disaster Management Authority (DDMA) - Champawat',
    type: 'health',
    status: 'open',
    contact: '05965-230703',
    website: 'champawat.nic.in/disaster-management',
    capacity: 350,
    occupancy: 140,
    lat: 29.3360,
    lng: 80.0910,
    address: 'District Collectorate, Champawat - 262523, Uttarakhand'
  }
];

// Updated quotes array with more comforting messages
const quotes = [
  {
    text: "You're in safe hands. Our network is here to support you 24/7.",
    author: "Disaster Response Team"
  },
  {
    text: "Together, we're stronger. Our community stands united in times of need.",
    author: "Emergency Response Network"
  },
  {
    text: "Stay calm and connected. Help is always within reach.",
    author: "Crisis Support Team"
  },
  {
    text: "Your safety is our priority. We're here to guide and protect.",
    author: "Emergency Services"
  },
  {
    text: "Take a deep breath.We're here to guide and protect. ",
    author: "Support Network"
  }
];

function App() {
  const [centers] = useState(initialCenters);
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isMinimalView, setIsMinimalView] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('minimalView') === 'true';
    }
    return false;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('minimalView', isMinimalView.toString());
  }, [isMinimalView]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hasAskedLocation = localStorage.getItem('hasAskedLocation');
    if (!hasAskedLocation) {
      setShowLocationModal(true);
    } else {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        setUserLocation(JSON.parse(savedLocation));
      }
    }
  }, []);

  const handleLocationRequest = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          localStorage.setItem('userLocation', JSON.stringify(location));
          localStorage.setItem('hasAskedLocation', 'true');
          setShowLocationModal(false);
          toast.success('Location successfully updated');
        },
        () => {
          toast.error('Unable to get your location');
          localStorage.setItem('hasAskedLocation', 'true');
          setShowLocationModal(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setShowLocationModal(false);
    }
  };

  // Filter centers based on search query
  const filteredCenters = centers.filter(center => 
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalCenters = 179;
  const healthCenters = centers.filter(c => c.type === 'health').length;
  const totalCapacity = centers.reduce((sum, c) => sum + c.capacity, 0);
  const totalOccupancy = centers.reduce((sum, c) => sum + c.occupancy, 0);
  
  const stats = {
    totalCenters,
    availableCapacity: totalCapacity - totalOccupancy,
    healthCenters,
    shelterCenters: totalCenters - healthCenters,
    occupancyRate: totalOccupancy / totalCapacity,
  };

  // Get the center point of India if no user location
  const defaultLocation = {
    lat: userLocation?.lat || 20.5937,
    lng: userLocation?.lng || 78.9629
  };

  if (isMinimalView) {
    return (
      <MinimalView 
        centers={centers} 
        onClose={() => setIsMinimalView(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold dark:text-white">Enable Location Services</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              To help you find the nearest disaster response centers, we need your location. 
              This information will only be used to show you nearby centers and will be stored locally on your device.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLocationRequest}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Allow Location Access
              </button>
              <button
                onClick={() => {
                  setShowLocationModal(false);
                  localStorage.setItem('hasAskedLocation', 'true');
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Heart className="w-8 h-8 text-red-500" />
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Disaster Response Platform</h1>
                <p className="text-gray-600 dark:text-gray-300">Find nearby health centers and shelters</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimalView(true)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Switch to minimal view"
                title="Switch to minimal view for low network connectivity"
              >
                <WifiOff className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow-inner">
            <div className="flex items-start gap-3">
              <Quote className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-lg text-blue-900 dark:text-blue-100 italic">"{quotes[currentQuote].text}"</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 font-medium">— {quotes[currentQuote].author}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <WeatherWarnings lat={defaultLocation.lat} lng={defaultLocation.lng} />
          </div>

          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search centers by name or address..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              Press / to search
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Stats data={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Map
              centers={filteredCenters}
              onCenterSelect={setSelectedCenterId}
              userLocation={userLocation}
              isDarkMode={isDarkMode}
            />
          </div>
          <div>
            <CenterList
              centers={filteredCenters}
              selectedCenterId={selectedCenterId}
              onCenterSelect={setSelectedCenterId}
              userLocation={userLocation}
            />
          </div>
        </div>

        <div className="mt-8">
          <EmailSubscription />
        </div>
      </main>
      <FAQChatbot />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
    </div>
  );
}

export default App;