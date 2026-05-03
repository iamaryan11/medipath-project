import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, useMapEvents, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../services/api';
import { useTheme } from '../hooks/ThemeContext';
import toast from 'react-hot-toast';
import AiChatbot from '../components/AiChatbot';


const userIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#005B96" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <circle cx="12" cy="12" r="3" fill="#ffffff"></circle>
</svg>
`;

const hospitalIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E11D48" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
  <path d="M12 7v6M9 10h6" stroke="#ffffff" stroke-width="2"></path>
</svg>
`;

const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(userIconSvg),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const hospitalIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(hospitalIconSvg),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const vehicleIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E11D48" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="1" y="3" width="15" height="13" rx="2"></rect>
  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
  <circle cx="5.5" cy="18.5" r="2.5"></circle>
  <circle cx="18.5" cy="18.5" r="2.5"></circle>
  <path d="M12 8v4m-2-2h4" stroke="#ffffff" stroke-width="2"></path>
</svg>
`;

const vehicleIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(vehicleIconSvg),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

const hazardIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F59E0B" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2L2 22h20L12 2z"></path>
  <path d="M12 8v6M12 18h.01" stroke="#ffffff" stroke-width="3"></path>
</svg>
`;

const hazardIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(hazardIconSvg),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

function MapUpdater({ center, routeData }) {
  const map = useMap();
  useEffect(() => {
    if (routeData && routeData.geometry) {
      try {
        const geojson = L.geoJSON(routeData.geometry);
        map.fitBounds(geojson.getBounds(), { padding: [50, 50], animate: true, duration: 1 });
      } catch (e) {
        console.error("Failed to fit bounds", e);
      }
    } else if (center) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, routeData, map]);
  return null;
}

function MapClickHandler({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

function VehicleMarker({ routeData, isActive }) {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!routeData || !routeData.geometry || routeData.geometry.type !== 'LineString') {
      setPosition(null);
      return;
    }

    const coords = routeData.geometry.coordinates;
    if (!coords || coords.length === 0) return;

    if (!isActive) {
      setPosition([coords[0][1], coords[0][0]]);
      return;
    }

    let index = 0;
    const startPos = [coords[0][1], coords[0][0]];
    setPosition(startPos);
    
    // Zoom in hard to the start position instantly when active
    map.setView(startPos, 16, { animate: true, duration: 0.5 });

    const interval = setInterval(() => {
      index += 1;
      if (index >= coords.length) {
        clearInterval(interval);
        return;
      }
      const newPos = [coords[index][1], coords[index][0]];
      setPosition(newPos);
      
      // Directly pan the map camera. Bypassing React state prevents the whole dashboard from re-rendering and glitching.
      map.panTo(newPos, { animate: true, duration: 0.8 });
    }, 800); 

    return () => clearInterval(interval);
  }, [routeData, isActive, map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={vehicleIcon} zIndexOffset={1000}>
      <Popup className="custom-popup">
        <div className="font-bold text-hosp-primary">Unit 404</div>
        <div className="text-xs text-hosp-muted">{isActive ? 'In Transit' : 'Awaiting Dispatch Command'}</div>
      </Popup>
    </Marker>
  );
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [userLoc, setUserLoc] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [logs, setLogs] = useState([{time: new Date().toLocaleTimeString(), msg: "SYSTEM INITIALIZED AND AWAITING ORIGIN."}]);
  const [vitals, setVitals] = useState({ hr: '--', bp: '--/--', o2: '--' });
  
  const addLog = (msg) => {
    setLogs(prev => [{time: new Date().toLocaleTimeString(), msg}, ...prev].slice(0, 10));
  };
  
  const [filters, setFilters] = useState({
    specialty: '',
    type: '',
    radius: 10,
    emergency: false
  });
  const [loading, setLoading] = useState(false);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [weather, setWeather] = useState({ temp: '--', desc: 'Loading...' });
  const [isListening, setIsListening] = useState(false);
  const [analyticsMode, setAnalyticsMode] = useState(false);
  const [hazards, setHazards] = useState([]);
  const [isDispatchActive, setIsDispatchActive] = useState(false);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=30.7333&longitude=76.7794&current_weather=true')
      .then(res => res.json())
      .then(data => {
        const code = data.current_weather.weathercode;
        let desc = 'Clear';
        if (code > 50) desc = 'Rain';
        if (code > 70) desc = 'Snow';
        if (code > 80) desc = 'Storm';
        if (code === 3 || code === 4) desc = 'Cloudy';
        setWeather({ temp: data.current_weather.temperature, desc });
      }).catch(() => setWeather({ temp: 'N/A', desc: 'Unavailable' }));
  }, []);

  useEffect(() => {
    if (userLoc) {
      const newHazards = [];
      for(let i=0; i<3; i++) {
        newHazards.push([userLoc[0] + (Math.random()-0.5)*0.08, userLoc[1] + (Math.random()-0.5)*0.08]);
      }
      setHazards(newHazards);
    }
  }, [userLoc]);

  const handleVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Browser does not support Voice Commands.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => { setIsListening(true); toast.success("Listening for commands..."); };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      addLog(`VOICE COMMAND: "${transcript}"`);
      if (transcript.includes("acquire") || transcript.includes("location")) {
        handleAcquireLocation();
      } else if (transcript.includes("emergency")) {
        setFilters(f => ({...f, emergency: true}));
        toast.success("Emergency filter activated.");
      } else if (transcript.includes("reset")) {
        setFilters({ specialty: '', type: '', radius: 10, emergency: false });
        toast.success("Filters reset.");
      } else {
        toast.error(`Command not recognized: "${transcript}"`);
      }
    };
    recognition.onerror = () => { setIsListening(false); toast.error("Microphone error."); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const defaultCenter = [30.7333, 76.7794];

  const handleAcquireLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported. Falling back to default location.');
      setUserLoc(defaultCenter);
      fetchNearestHospitals(defaultCenter[0], defaultCenter[1]);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLoc([lat, lng]);
        fetchNearestHospitals(lat, lng);
      },
      (error) => {
        console.warn('Unable to retrieve location automatically', error);
        toast.error("GPS Unavailable (macOS CoreLocation Error). Auto-falling back to Chandigarh center.");
        setUserLoc(defaultCenter);
        fetchNearestHospitals(defaultCenter[0], defaultCenter[1]);
        setLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  useEffect(() => {
    // Automatically try to acquire location on load
    handleAcquireLocation();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!routeData) return;
    const interval = setInterval(() => {
      setVitals({
        hr: Math.floor(75 + Math.random() * 35),
        bp: `${Math.floor(115 + Math.random() * 20)}/${Math.floor(75 + Math.random() * 15)}`,
        o2: Math.floor(92 + Math.random() * 8)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [routeData]);

  const fetchNearestHospitals = async (lat, lng, overrides = null) => {
    try {
      setLoading(true);
      let limit = overrides?.limit || filters.radius;
      let url = `/hospitals/nearest?lat=${lat}&lng=${lng}&limit=${limit}`;
      
      const applySpecialty = overrides ? overrides.specialty : filters.specialty;
      const applyType = overrides ? overrides.type : filters.type;
      const applyEmergency = overrides ? overrides.emergency : filters.emergency;

      if (applySpecialty) url += `&specialty=${applySpecialty}`;
      if (applyType) url += `&type=${applyType}`;
      if (applyEmergency) url += `&emergency=true`;

      const response = await api.get(url);
      setHospitals(response.data.data);
      setRouteData(null); 
      
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch hospitals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteToHospital = async (hospital) => {
    if (!userLoc) return;
    setRoutingLoading(true);
    
    const destLng = hospital.location.coordinates[0];
    const destLat = hospital.location.coordinates[1];

    try {
      const response = await api.post('/hospitals/route', {
        start_lat: userLoc[0],
        start_lng: userLoc[1],
        end_lat: destLat,
        end_lng: destLng
      });
      
      if (response.data.success) {
        setIsDispatchActive(false);
        setRouteData({
          geometry: response.data.geometry,
          distance: response.data.distance_km,
          duration: response.data.duration_minutes,
          hospital: hospital
        });
        addLog(`ROUTE CALCULATED FOR: ${hospital.name.toUpperCase()}`);
        addLog(`ETA: ${response.data.duration_minutes} MIN | DISTANCE: ${response.data.distance_km} KM`);
      } else {
        toast.error('Failed to calculate route: ' + response.data.message);
      }
    } catch (err) {
      console.error("Routing error:", err);
      toast.error('Failed to connect to ML routing service.');
    } finally {
      setRoutingLoading(false);
    }
  };

  const handleSOS = async () => {
    if (!userLoc) {
      toast.error("Please acquire your location first to trigger SOS routing.");
      return;
    }
    // Force find nearest single 24/7 ER
    const nearestERs = await fetchNearestHospitals(userLoc[0], userLoc[1], { emergency: true, limit: 1, specialty: '' });
    if (nearestERs && nearestERs.length > 0) {
      handleRouteToHospital(nearestERs[0]);
    } else {
      toast.error("CRITICAL: No 24/7 ER found in immediate vicinity.");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-hosp-bg overflow-hidden font-body">
      {/* Top Navbar */}
      <nav className="bg-hosp-surface border-b border-hosp-border px-6 py-4 flex justify-between items-center z-20 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded border-2 border-hosp-primary flex items-center justify-center bg-hosp-surface">
            <svg className="w-6 h-6 text-hosp-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-heading font-black text-hosp-text tracking-widest uppercase leading-none">
              MediPath
            </h1>
            <span className="text-[10px] font-bold text-hosp-primary tracking-widest uppercase mt-1">Clinical Dispatch</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 bg-hosp-bg border border-hosp-border px-3 py-1.5 rounded-lg shadow-inner">
            <svg className="w-5 h-5 text-hosp-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-hosp-muted uppercase tracking-wider leading-none">Chandigarh Weather</span>
              <span className="text-sm font-bold text-hosp-text leading-none mt-1">{weather.temp}°C - {weather.desc}</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-hosp-text">System Online</span>
          </div>
          <div className="h-6 w-px bg-hosp-border hidden md:block"></div>
          
          <button 
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-hosp-bg text-hosp-muted hover:text-hosp-primary transition-colors border border-transparent hover:border-hosp-border z-50 cursor-pointer"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-hosp-primary font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'O'}
            </div>
            <span className="text-sm font-bold text-hosp-text hidden sm:block">{user?.name}</span>
          </div>
          <button 
            onClick={logout}
            className="text-xs font-bold uppercase tracking-wider text-hosp-muted hover:text-hosp-primary transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Sidebar Controls */}
        <aside className="w-full lg:w-96 flex-1 lg:flex-none min-h-0 bg-hosp-surface lg:border-r border-hosp-border p-6 flex flex-col gap-6 z-10 overflow-y-auto shadow-md">
          
          <button 
            onClick={handleSOS}
            className="w-full bg-hosp-accent hover:bg-hosp-accent-dark text-white py-4 rounded-xl font-extrabold tracking-wide uppercase transition-all shadow-[0_4px_15px_rgba(225,29,72,0.3)] active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            ONE-TOUCH SOS
          </button>

          <div className="flex gap-2 w-full">
            <button 
              onClick={handleVoiceCommand}
              className={`flex-1 ${isListening ? 'bg-hosp-primary text-white' : 'bg-hosp-surface text-hosp-text border border-hosp-border'} py-3 rounded-xl font-bold uppercase text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2`}
            >
              <svg className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              {isListening ? 'LISTENING...' : 'VOICE DISPATCH'}
            </button>

            <button 
              onClick={() => setAnalyticsMode(!analyticsMode)}
              className={`flex-1 ${analyticsMode ? 'bg-purple-600 border-purple-700 text-white' : 'bg-hosp-surface text-hosp-text border border-hosp-border'} py-3 rounded-xl font-bold uppercase text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              ANALYTICS MODE
            </button>
          </div>

          <hr className="border-hosp-border" />

          <div>
            <h2 className="text-lg font-heading font-bold text-hosp-text mb-1">Standard Dispatch Parameters</h2>
          </div>
          
          <div className="bg-hosp-bg border border-hosp-border rounded-xl p-5 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-hosp-primary rounded-l-xl"></div>
            <div className="flex flex-col items-center justify-center mb-4 gap-1">
              <span className="text-xs font-bold text-hosp-primary tracking-widest uppercase">Origin Point</span>
              <span className="text-xs text-hosp-text font-mono font-bold bg-hosp-surface px-3 py-1 rounded border border-hosp-border shadow-sm">
                {userLoc ? `${userLoc[0].toFixed(4)}, ${userLoc[1].toFixed(4)}` : 'GPS Signal: Wait'}
              </span>
              <span className="text-[10px] text-hosp-muted text-center mt-1">(Or click anywhere on map to drop a pin)</span>
            </div>
            <button 
              onClick={handleAcquireLocation}
              disabled={loading}
              className="w-full bg-hosp-surface border border-hosp-border hover:bg-hosp-bg text-hosp-primary py-2.5 rounded-lg font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Acquiring Satellites...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Acquire Location
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-hosp-text uppercase tracking-wider mb-2">Required Specialty</label>
              <div className="relative">
                <select 
                  className="appearance-none w-full bg-hosp-surface border border-hosp-border rounded-lg px-4 py-3 text-hosp-text focus:outline-none focus:border-hosp-primary focus:ring-1 focus:ring-hosp-primary shadow-sm"
                  value={filters.specialty}
                  onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                >
                  <option value="">General Admission (Any)</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedic">Orthopedics</option>
                  <option value="Obstetrics">Obstetrics & Gynecology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-hosp-muted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-hosp-text uppercase tracking-wider mb-2">Facility Type</label>
              <div className="relative">
                <select 
                  className="appearance-none w-full bg-hosp-surface border border-hosp-border rounded-lg px-4 py-3 text-hosp-text focus:outline-none focus:border-hosp-primary focus:ring-1 focus:ring-hosp-primary shadow-sm"
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="">Any Sector</option>
                  <option value="Government">Public / Government</option>
                  <option value="Private">Private Enterprise</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-hosp-muted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-hosp-text uppercase tracking-wider mb-2">Search Radius (Facilities)</label>
              <input 
                type="range" 
                min="5" max="30" step="5"
                value={filters.radius}
                onChange={(e) => setFilters({...filters, radius: parseInt(e.target.value)})}
                className="w-full accent-hosp-primary"
              />
              <div className="text-xs text-hosp-muted font-bold text-right mt-1">Nearest {filters.radius} facilities</div>
            </div>
            
            <div className="flex items-center p-4 bg-hosp-surface border border-hosp-border rounded-lg shadow-sm">
              <input 
                type="checkbox" 
                id="emergency" 
                className="w-5 h-5 accent-hosp-accent rounded border-gray-300 cursor-pointer"
                checked={filters.emergency}
                onChange={(e) => setFilters({...filters, emergency: e.target.checked})}
              />
              <label htmlFor="emergency" className="ml-3 text-sm font-bold text-hosp-text cursor-pointer select-none">
                Emergency 24x7 Only
              </label>
            </div>

            <div className="bg-[#0f172a] rounded-lg p-3 border border-[#1e293b] font-mono text-[10px] overflow-hidden shadow-inner h-28 flex flex-col">
              <div className="text-hosp-primary mb-1 uppercase font-bold tracking-widest border-b border-[#1e293b] pb-1">TERMINAL LOG</div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-[#94a3b8]">
                    <span className="text-[#38bdf8] mr-2">[{log.time}]</span>
                    {log.msg}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-hosp-border space-y-4">
             {routeData && (
                <div className="bg-hosp-surface border border-hosp-primary/30 rounded-lg p-4 shadow-sm animate-pulse-light">
                  <h4 className="text-hosp-primary font-bold mb-2">Active Route: {routeData.hospital.name}</h4>
                  <div className="flex justify-between text-sm text-hosp-text mb-3">
                    <span className="font-semibold">Distance: <strong className="text-hosp-primary">{routeData.distance} km</strong></span>
                    <span className="font-semibold">ETA: <strong className="text-hosp-primary">{routeData.duration} min</strong></span>
                  </div>
                  <div className="bg-hosp-bg rounded p-2 border border-hosp-border flex justify-between items-center text-xs">
                     <div className="text-center">
                       <div className="text-hosp-muted font-bold uppercase text-[9px] mb-1">HR (BPM)</div>
                       <div className="text-hosp-accent font-mono font-bold">{vitals.hr}</div>
                     </div>
                     <div className="text-center">
                       <div className="text-hosp-muted font-bold uppercase text-[9px] mb-1">BP (mmHg)</div>
                       <div className="text-blue-500 font-mono font-bold">{vitals.bp}</div>
                     </div>
                     <div className="text-center">
                       <div className="text-hosp-muted font-bold uppercase text-[9px] mb-1">SpO2</div>
                       <div className="text-green-500 font-mono font-bold">{vitals.o2}%</div>
                     </div>
                   </div>
                   
                   {!isDispatchActive ? (
                     <button 
                       onClick={() => { setIsDispatchActive(true); addLog(`UNIT 404 DISPATCHED TO ${routeData.hospital.name.toUpperCase()}`); }}
                       className="w-full mt-3 bg-hosp-accent hover:bg-hosp-accent-dark text-white py-2 rounded font-bold uppercase text-xs shadow transition-colors"
                     >
                       INITIATE DISPATCH (START)
                     </button>
                   ) : (
                     <div className="w-full mt-3 bg-green-600 text-white py-2 rounded font-bold uppercase text-xs shadow text-center animate-pulse">
                       UNIT EN ROUTE
                     </div>
                   )}
                </div>
             )}
             <button 
               onClick={() => {
                 if (userLoc) fetchNearestHospitals(userLoc[0], userLoc[1]);
               }}
               disabled={!userLoc || loading}
               className="w-full bg-hosp-bg hover:bg-gray-100 text-hosp-primary border border-hosp-border py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
                {loading ? 'Querying...' : 'Search Facilities'}
             </button>
          </div>
        </aside>

        {/* Map Container */}
        <main className="flex-1 min-h-0 relative bg-hosp-bg z-0">
          <MapContainer 
            center={userLoc || defaultCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            {/* CartoDB Map Layer */}
            <TileLayer
              key={theme + (analyticsMode ? '-analytics' : '')}
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url={analyticsMode 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                : (theme === 'dark' ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png")}
            />
            
            {/* Analytics Heatmap Render */}
            {analyticsMode && hospitals.map(h => {
              // Create glowing heat circles around hospitals based on size
              return (
                <CircleMarker 
                  key={`heat-${h._id}`}
                  center={[h.location.coordinates[1], h.location.coordinates[0]]}
                  radius={Math.min((h.totalBeds || 50) / 10, 40)}
                  pathOptions={{
                    color: h.emergency24x7 ? '#ef4444' : '#8b5cf6',
                    fillColor: h.emergency24x7 ? '#ef4444' : '#8b5cf6',
                    fillOpacity: 0.15,
                    stroke: false
                  }}
                />
              )
            })}

            {/* Traffic Hazard Layer */}
            {hazards.map((haz, i) => (
              <Marker key={`hazard-${i}`} position={haz} icon={hazardIcon}>
                <Popup className="custom-popup">
                  <div className="font-bold text-yellow-600">Active Road Hazard</div>
                  <div className="text-xs">Severity Level: High</div>
                </Popup>
              </Marker>
            ))}

            <MapUpdater center={userLoc} routeData={routeData} />
            <MapClickHandler setLocation={(loc) => {
              setUserLoc(loc);
              addLog(`MANUAL OVERRIDE: LOCATION SET TO ${loc[0].toFixed(4)}, ${loc[1].toFixed(4)}`);
              fetchNearestHospitals(loc[0], loc[1]);
            }} />

            {/* User Location Marker */}
            {userLoc && (
              <Marker position={userLoc} icon={userIcon}>
                <Popup className="custom-popup">
                  <div className="font-bold text-hosp-primary">Dispatch Origin</div>
                  <div className="text-sm text-gray-600">Your current location.</div>
                </Popup>
              </Marker>
            )}

            {/* Hospital Markers */}
            {hospitals.map((hospital) => {
              const beds = hospital.totalBeds || 150;
              const idVal = parseInt(hospital._id.substring(hospital._id.length - 4), 16) || 0;
              const fakeRatio = ((idVal % 40) + 10) / 100;
              const availableBeds = Math.floor(beds * fakeRatio);
              const bedColor = availableBeds > 20 ? 'text-green-600' : 'text-red-600';
              
              return (
                <Marker 
                  key={hospital._id} 
                  position={[hospital.location.coordinates[1], hospital.location.coordinates[0]]} 
                  icon={hospitalIcon}
                >
                  <Popup className="custom-popup min-w-[220px]">
                    <div className="font-extrabold text-hosp-text text-base mb-1 leading-tight">{hospital.name}</div>
                    <div className="text-xs font-semibold text-hosp-muted mb-2">{hospital.address.city}, {hospital.address.sector}</div>
                    
                    <div className="flex justify-between items-center bg-hosp-bg border border-hosp-border p-2 rounded mb-3">
                       <span className="text-xs font-bold text-hosp-muted uppercase tracking-wide">Beds Available</span>
                       <span className={`font-bold ${bedColor}`}>{availableBeds} / {hospital.totalBeds}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {hospital.emergency24x7 && (
                        <span className="bg-hosp-surface border border-hosp-accent text-hosp-accent text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">24x7 ER</span>
                      )}
                      <span className="bg-hosp-surface border border-hosp-primary text-hosp-primary text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">{hospital.type}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleRouteToHospital(hospital)}
                        disabled={routingLoading}
                        className="w-full bg-hosp-primary hover:bg-hosp-primary-dark text-white py-2.5 rounded font-bold text-sm transition-colors shadow-sm"
                      >
                        {routingLoading ? 'Calculating...' : 'Deploy Unit to Facility'}
                      </button>
                      
                      <a 
                        href={userLoc 
                          ? `https://www.google.com/maps/dir/?api=1&origin=${userLoc[0]},${userLoc[1]}&destination=${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`
                          : `https://www.google.com/maps/search/?api=1&query=${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
                        Open in Google Maps
                      </a>
                    </div>
                  </Popup>
                </Marker>
              )
            })}

            {/* OSRM Polyline Route */}
            {routeData && (
              <GeoJSON 
                key={`route-${routeData.hospital._id}`} 
                data={routeData.geometry}
                style={{
                  color: '#005B96',
                  weight: 5,
                  opacity: 0.9,
                  dashArray: '10, 10',
                  lineCap: 'round',
                  lineJoin: 'round',
                  className: 'animate-route'
                }}
              />
            )}
            {/* Moving Vehicle */}
            <VehicleMarker routeData={routeData} isActive={isDispatchActive} />
          </MapContainer>
        </main>
      </div>
      
      {/* AI Chatbot Widget */}
      <AiChatbot />
    </div>
  );
};

export default Dashboard;
