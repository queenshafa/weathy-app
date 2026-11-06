import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  RefreshCw, 
  CloudSun, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Sun, 
  CloudLightning,
  RotateCcw,
  CloudFog,
  CloudDrizzle,
  Cloud,
  Navigation,
  Search,
  Compass,
  Check,
  Sparkles,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Zap,
  Leaf
} from 'lucide-react';
import { 
  WeatherModel, 
  getWeatherCondition,
  getUvCategory,
  getWindDirectionInfo,
  getVisibilityInfo,
  getPressureInfo
} from '../types/weather';
import { SAMPLE_CUACAKITA_DATA, INDONESIAN_LOCATIONS, IndonesianLocation } from '../data/sampleData';
import { WeatherAtmosphereEffect, WeatherEffectType } from './WeatherAtmosphereEffect';

interface DesktopWeatherViewProps {
  initialLocation?: IndonesianLocation;
  onSelectCodeTab?: (fileName: string) => void;
}

const REGION_TABS = [
  'Semua',
  'Jawa',
  'Sumatera',
  'Bali & Nusa Tenggara',
  'Kalimantan',
  'Sulawesi',
  'Maluku & Papua'
] as const;

export const DesktopWeatherView: React.FC<DesktopWeatherViewProps> = ({ initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<IndonesianLocation>(initialLocation || INDONESIAN_LOCATIONS[0]);
  const [isCurrentGpsLocation, setIsCurrentGpsLocation] = useState(false);
  const [simulatedState, setSimulatedState] = useState<'data' | 'loading' | 'error'>('data');
  const [useLiveApi, setUseLiveApi] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherModel>(SAMPLE_CUACAKITA_DATA);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionTab, setSelectedRegionTab] = useState<string>('Semua');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [atmosphereOverride, setAtmosphereOverride] = useState<WeatherEffectType>('auto');

  // Fetch data from Open-Meteo API
  const fetchApiData = async (loc: IndonesianLocation) => {
    setIsFetching(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation,weather_code&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m,precipitation_probability,precipitation,surface_pressure,visibility,wind_direction_10m,uv_index,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&forecast_days=7&timezone=Asia%2FJakarta`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Open-Meteo HTTP error: ${res.status}`);
      }
      const data: WeatherModel = await res.json();
      setWeatherData(data);
      setSimulatedState('data');
    } catch (err: any) {
      if (useLiveApi) {
        setErrorMessage(err.message || 'Koneksi ke Open-Meteo API terputus');
        setSimulatedState('error');
      } else {
        setWeatherData(SAMPLE_CUACAKITA_DATA);
        setSimulatedState('data');
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (useLiveApi) {
      fetchApiData(selectedLocation);
    } else {
      setWeatherData(SAMPLE_CUACAKITA_DATA);
    }
  }, [selectedLocation, useLiveApi]);

  const handleRefresh = () => {
    if (simulatedState === 'loading') return;
    setSimulatedState('loading');
    setTimeout(() => {
      if (useLiveApi) {
        fetchApiData(selectedLocation);
      } else {
        setWeatherData(SAMPLE_CUACAKITA_DATA);
        setSimulatedState('data');
      }
    }, 600);
  };

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(4));
          const lon = parseFloat(position.coords.longitude.toFixed(4));
          const gpsLoc: IndonesianLocation = {
            name: 'Lokasi Saya',
            region: `GPS (${lat}, ${lon})`,
            island: 'Jawa',
            latitude: lat,
            longitude: lon,
          };
          setSelectedLocation(gpsLoc);
          setIsCurrentGpsLocation(true);
          setGpsLoading(false);
        },
        (_error) => {
          const fallbackLoc: IndonesianLocation = {
            name: 'Lokasi Saya',
            region: 'GPS Otomatis (Jakarta)',
            island: 'Jawa',
            latitude: -6.2088,
            longitude: 106.8456,
          };
          setSelectedLocation(fallbackLoc);
          setIsCurrentGpsLocation(true);
          setGpsLoading(false);
        },
        { timeout: 7000 }
      );
    } else {
      const fallbackLoc: IndonesianLocation = {
        name: 'Lokasi Saya',
        region: 'GPS Otomatis (Jakarta)',
        island: 'Jawa',
        latitude: -6.2088,
        longitude: 106.8456,
      };
      setSelectedLocation(fallbackLoc);
      setIsCurrentGpsLocation(true);
      setGpsLoading(false);
    }
  };

  const current = weatherData.current;
  const hourly = weatherData.hourly;
  const daily = weatherData.daily;

  const conditionInfo = getWeatherCondition(current.weather_code ?? 2);
  const curTemp = current.temperature_2m;
  const maxTempDaily = daily.temperature_2m_max?.[0] ?? curTemp;
  const minTempDaily = daily.temperature_2m_min?.[0] ?? curTemp;
  const rainProbMaxDaily = daily.precipitation_probability_max?.[0] ?? 40;
  const rainSumDaily = daily.precipitation_sum?.[0] ?? 1.8;
  const windMaxDaily = daily.wind_speed_10m_max?.[0] ?? current.wind_speed_10m;

  const apparentTemp = current.apparent_temperature ?? (curTemp + 2.4);
  const uvIndex = daily.uv_index_max?.[0] ?? hourly.uv_index?.[12] ?? 9.4;
  const windDirection = current.wind_direction_10m ?? hourly.wind_direction_10m?.[0] ?? 135;
  const visibility = hourly.visibility?.[0] ?? 10000;
  const surfacePressure = current.surface_pressure ?? hourly.surface_pressure?.[0] ?? 1012.3;
  const dewPoint = hourly.dew_point_2m?.[0] ?? (curTemp - ((100 - current.relative_humidity_2m) / 5));

  const uvCategory = getUvCategory(uvIndex);
  const windDirInfo = getWindDirectionInfo(windDirection);
  const visibilityInfo = getVisibilityInfo(visibility);
  const pressureInfo = getPressureInfo(surfacePressure);

  // Weekly Min-Max Bar calculation
  const allWeeklyMin = Math.min(...daily.temperature_2m_min);
  const allWeeklyMax = Math.max(...daily.temperature_2m_max);
  const weeklyRange = allWeeklyMax - allWeeklyMin === 0 ? 1 : allWeeklyMax - allWeeklyMin;

  // Weather icon renderer
  const renderWeatherIcon = (code: number, className = "w-5 h-5") => {
    if (code === 0) return <Sun className={`${className} text-amber-300 drop-shadow`} />;
    if (code === 1 || code === 2) return <CloudSun className={`${className} text-sky-200 drop-shadow`} />;
    if (code === 3) return <Cloud className={`${className} text-slate-300 drop-shadow`} />;
    if (code === 45 || code === 48) return <CloudFog className={`${className} text-slate-300 drop-shadow`} />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className={`${className} text-cyan-300 drop-shadow`} />;
    if (code >= 61 && code <= 65) return <CloudRain className={`${className} text-blue-300 drop-shadow`} />;
    if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-blue-400 drop-shadow`} />;
    if (code >= 95) return <CloudLightning className={`${className} text-yellow-300 drop-shadow`} />;
    return <CloudSun className={`${className} text-sky-200 drop-shadow`} />;
  };

  // Filter cities for search & region
  const filteredCities = INDONESIAN_LOCATIONS.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = 
      selectedRegionTab === 'Semua' || c.island === selectedRegionTab;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 select-none">
      
      {/* Top Desktop Atmospheric Window Frame (Apple macOS Style) */}
      <div className="bg-gradient-to-b from-[#1F3E61] via-[#162D47] to-[#0D1D2E] rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl relative flex flex-col min-h-[880px]">
        
        {/* Canvas Weather Atmosphere Effect (Sun God-Rays at Top Corner, Rain Streaks, Blowing Leaves, Thunderstorm) */}
        <WeatherAtmosphereEffect
          weatherCode={current.weather_code ?? 0}
          windSpeed={current.wind_speed_10m}
          precipitation={current.precipitation}
          overrideEffect={atmosphereOverride}
        />

        {/* macOS Window Title Bar */}
        <div className="bg-[#0f1d2e]/70 backdrop-blur-md border-b border-white/10 px-5 py-3 flex items-center justify-between text-white/80 z-30">
          <div className="flex items-center gap-3">
            {/* macOS Window Traffic Lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            <span className="text-xs font-semibold text-white/90 ml-2 tracking-wide flex items-center gap-1.5">
              Weathy Desktop
              <span className="text-[10px] text-white/40 font-normal">
                — {selectedLocation.name}, Indonesia ({selectedLocation.latitude}, {selectedLocation.longitude})
              </span>
            </span>
          </div>

          {/* Quick Effect Switcher Toolbar in Titlebar */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setAtmosphereOverride('auto')}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  atmosphereOverride === 'auto' ? 'bg-blue-600 text-white font-medium' : 'text-white/70 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Adaptif</span>
              </button>
              <button
                onClick={() => setAtmosphereOverride('sunny')}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  atmosphereOverride === 'sunny' ? 'bg-amber-500 text-white font-medium' : 'text-white/70 hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Cahaya</span>
              </button>
              <button
                onClick={() => setAtmosphereOverride('rainy')}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  atmosphereOverride === 'rainy' ? 'bg-cyan-600 text-white font-medium' : 'text-white/70 hover:text-white'
                }`}
              >
                <CloudRain className="w-3 h-3" />
                <span>Hujan</span>
              </button>
              <button
                onClick={() => setAtmosphereOverride('windy')}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  atmosphereOverride === 'windy' ? 'bg-emerald-600 text-white font-medium' : 'text-white/70 hover:text-white'
                }`}
              >
                <Leaf className="w-3 h-3" />
                <span>Angin &amp; Daun</span>
              </button>
              <button
                onClick={() => setAtmosphereOverride('storm')}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  atmosphereOverride === 'storm' ? 'bg-indigo-600 text-white font-medium' : 'text-white/70 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Badai</span>
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80"
              title="Perbarui Cuaca"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching || simulatedState === 'loading' ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Desktop Split Layout (Sidebar + Content Dashboard) */}
        <div className="flex-1 flex flex-col lg:flex-row relative z-20 overflow-hidden">
          
          {/* Left Sidebar: Indonesian Provinces & Cities */}
          <aside className="w-full lg:w-72 bg-[#0e1c2c]/80 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Wilayah Indonesia
                </h3>
                <span className="text-[10px] text-white/50">
                  {INDONESIAN_LOCATIONS.length} Titik
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kota atau provinsi..."
                  className="w-full bg-white/10 border border-white/15 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Regional Island Filters */}
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {REGION_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedRegionTab(tab)}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedRegionTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* GPS Sensor Quick Button */}
              <button
                onClick={handleUseCurrentLocation}
                disabled={gpsLoading}
                className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all ${
                  isCurrentGpsLocation
                    ? 'bg-blue-600/40 border border-cyan-400/50 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-300" />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Lokasi Saya (GPS)
                    </div>
                    <div className="text-[10px] text-white/60">
                      Sensor koordinat otomatis
                    </div>
                  </div>
                </div>
                {isCurrentGpsLocation && <Check className="w-3.5 h-3.5 text-cyan-300" />}
              </button>

              {/* City List Scrollable */}
              <div className="overflow-y-auto max-h-[520px] space-y-1 pr-1 no-scrollbar">
                {filteredCities.map((city) => {
                  const isSelected = selectedLocation.name === city.name && !isCurrentGpsLocation;
                  return (
                    <button
                      key={city.name}
                      onClick={() => {
                        setSelectedLocation(city);
                        setIsCurrentGpsLocation(false);
                      }}
                      className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-colors ${
                        isSelected
                          ? 'bg-white/20 border border-white/30 text-white font-medium'
                          : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3 h-3 text-white/50 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs text-white truncate">
                            {city.name}
                          </div>
                          <div className="text-[10px] text-white/50 truncate">
                            {city.region}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-cyan-300 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live API toggle on sidebar bottom */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <span>Mode Live API</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLiveApi}
                  onChange={(e) => setUseLiveApi(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </aside>

          {/* Right Main Dashboard Area */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6 text-white no-scrollbar">
            
            {/* Riverpod State Handler */}
            {simulatedState === 'loading' ? (
              <div className="space-y-6 animate-pulse pt-8">
                <div className="h-28 w-80 bg-white/10 rounded-3xl" />
                <div className="h-40 bg-white/10 rounded-3xl" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-32 bg-white/10 rounded-3xl" />
                  <div className="h-32 bg-white/10 rounded-3xl" />
                  <div className="h-32 bg-white/10 rounded-3xl" />
                </div>
              </div>
            ) : simulatedState === 'error' ? (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/15 text-center flex flex-col items-center justify-center my-20 shadow-xl max-w-md mx-auto">
                <AlertTriangle className="w-12 h-12 text-amber-300 mb-3 stroke-[1.5]" />
                <h3 className="font-semibold text-white text-lg mb-1">
                  Gagal Memuat Cuaca
                </h3>
                <p className="text-xs text-white/70 mb-5 leading-relaxed">
                  {errorMessage || 'WeatherException: Terputus dari Open-Meteo API'}
                </p>
                <button
                  onClick={() => {
                    setSimulatedState('data');
                    setErrorMessage('');
                  }}
                  className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-2xl flex items-center gap-2 border border-white/20 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Coba Lagi
                </button>
              </div>
            ) : (
              <>
                {/* 1. Grand Widescreen Apple Hero Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pt-2">
                  <div>
                    <div className="flex items-center gap-2 text-white/90">
                      {isCurrentGpsLocation && (
                        <Navigation className="w-4 h-4 fill-white text-white rotate-45" />
                      )}
                      <h1 className="text-4xl lg:text-5xl font-light tracking-wide drop-shadow-sm">
                        {selectedLocation.name}
                      </h1>
                    </div>
                    <p className="text-sm text-white/70 mt-1">
                      {selectedLocation.region} ({selectedLocation.island}) • Terpantau {current.time.replace('T', ' ')}
                    </p>

                    <div className="text-sm font-medium text-white/90 capitalize mt-2 flex items-center gap-2">
                      <span className="p-1 bg-white/10 rounded-lg">
                        {renderWeatherIcon(current.weather_code, "w-5 h-5")}
                      </span>
                      <span>{conditionInfo.label}</span>
                      <span className="text-white/40">·</span>
                      <span className="text-xs text-white/80">
                        Tertinggi {Math.round(maxTempDaily)}° · Terendah {Math.round(minTempDaily)}°
                      </span>
                    </div>
                  </div>

                  {/* Gigantic Light Temperature */}
                  <div className="text-right">
                    <div className="text-8xl lg:text-9xl font-extralight tracking-tighter text-white drop-shadow-lg leading-none">
                      {Math.round(curTemp)}°
                    </div>
                    <div className="text-xs text-white/75 mt-1 font-medium">
                      Suhu Terasa {Math.round(curTemp + 1.2)}°C
                    </div>
                  </div>
                </div>

                {/* 2. Apple 24-Hour Horizontal Strip */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl">
                  <div className="text-xs font-semibold text-white/70 tracking-wider uppercase mb-4 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-white/60" />
                    <span>Prakiraan Per Jam &amp; Peluang Presipitasi</span>
                  </div>

                  <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar text-center">
                    {hourly.time.slice(0, 18).map((t, idx) => {
                      const hourOnly = t.split('T')[1].substring(0, 5);
                      const isNow = idx === 0;
                      const temp = Math.round(hourly.temperature_2m[idx]);
                      const code = hourly.weather_code[idx];
                      const rainProb = hourly.precipitation_probability[idx];

                      return (
                        <div key={idx} className="min-w-[58px] flex flex-col items-center justify-between gap-2 py-1">
                          <span className="text-xs font-medium text-white/80">
                            {isNow ? 'Kini' : hourOnly}
                          </span>
                          <div className="my-1 scale-110">
                            {renderWeatherIcon(code, "w-6 h-6")}
                          </div>
                          {rainProb > 0 ? (
                            <span className="text-[11px] text-cyan-300 font-semibold">
                              {rainProb}%
                            </span>
                          ) : (
                            <div className="h-4" />
                          )}
                          <span className="text-sm font-semibold text-white">
                            {temp}°
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Middle Section: 7-Day Forecast & Bento Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Left Column: 7-Day Forecast with Colored Apple Temperature Bars (5 Cols) */}
                  <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white/70 tracking-wider uppercase mb-3 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-white/60" />
                        <span>Prakiraan Cuaca 7 Hari</span>
                      </div>

                      <div className="divide-y divide-white/10">
                        {daily.time.map((date, idx) => {
                          const code = daily.weather_code[idx];
                          const maxT = Math.round(daily.temperature_2m_max[idx]);
                          const minT = Math.round(daily.temperature_2m_min[idx]);
                          const isToday = idx === 0;
                          const dayName = isToday 
                            ? 'Hari Ini' 
                            : new Date(date).toLocaleDateString('id-ID', { weekday: 'long' });

                          const leftPercent = Math.max(0, ((daily.temperature_2m_min[idx] - allWeeklyMin) / weeklyRange) * 100);
                          const rightPercent = Math.min(100, ((daily.temperature_2m_max[idx] - allWeeklyMin) / weeklyRange) * 100);
                          const barWidth = Math.max(12, rightPercent - leftPercent);
                          const curTempPos = Math.max(0, Math.min(100, ((curTemp - allWeeklyMin) / weeklyRange) * 100));

                          return (
                            <div key={idx} className="py-3 flex items-center justify-between text-xs">
                              {/* Day Name */}
                              <span className={`w-20 truncate ${isToday ? 'font-bold text-white' : 'text-white/80'}`}>
                                {dayName}
                              </span>

                              {/* Icon */}
                              <div className="w-8 flex justify-center">
                                {renderWeatherIcon(code, "w-4 h-4")}
                              </div>

                              {/* Min Temp */}
                              <span className="w-8 text-right text-white/60 font-medium">
                                {minT}°
                              </span>

                              {/* Colored Horizontal Temperature Range Bar */}
                              <div className="flex-1 mx-3 h-1.5 bg-black/30 rounded-full relative overflow-hidden">
                                <div 
                                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-amber-300 to-orange-400"
                                  style={{
                                    left: `${leftPercent}%`,
                                    width: `${barWidth}%`
                                  }}
                                />
                                {isToday && (
                                  <div 
                                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-slate-900 shadow-sm"
                                    style={{ left: `calc(${curTempPos}% - 5px)` }}
                                  />
                                )}
                              </div>

                              {/* Max Temp */}
                              <span className="w-8 text-left text-white font-semibold">
                                {maxT}°
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-[11px] text-white/60 pt-3 border-t border-white/10 mt-3 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Rentang mingguan: {Math.round(allWeeklyMin)}°C sampai {Math.round(allWeeklyMax)}°C</span>
                    </div>
                  </div>

                  {/* Right Column: Apple Desktop Bento Grid (7 Cols) — 6 Parameter Tambahan Lengkap */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* 1. Indeks UV Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/60 tracking-wider uppercase mb-1">
                          <Sun className="w-4 h-4 text-amber-300" />
                          <span>Indeks UV</span>
                        </div>
                        <div className="text-3xl font-light text-white mt-1 flex items-baseline gap-2">
                          <span>{uvIndex.toFixed(1)}</span>
                          <span className={`text-xs font-semibold ${uvCategory.color}`}>
                            {uvCategory.label}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 via-orange-400 to-purple-500 relative overflow-hidden">
                          <div 
                            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-slate-900 shadow-sm"
                            style={{ left: `calc(${Math.min(100, (uvIndex / 12) * 100)}% - 5px)` }}
                          />
                        </div>
                        <div className="text-xs text-white/75 mt-2 leading-relaxed">
                          {uvCategory.advice}
                        </div>
                      </div>
                    </div>

                    {/* 2. Suhu Terasa (Apparent Temperature) Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/60 tracking-wider uppercase mb-1">
                          <Thermometer className="w-4 h-4 text-amber-300" />
                          <span>Suhu Terasa</span>
                        </div>
                        <div className="text-3xl font-light text-white mt-1">
                          {Math.round(apparentTemp)}°
                        </div>
                      </div>
                      <div className="text-xs text-white/75 mt-3 leading-relaxed">
                        {apparentTemp > curTemp 
                          ? `Terasa ${(apparentTemp - curTemp).toFixed(1)}° lebih hangat dari suhu aktual akibat kelembapan tinggi ${current.relative_humidity_2m}%.` 
                          : 'Suhu yang dirasakan tubuh serupa dengan suhu udara aktual.'}
                      </div>
                    </div>

                    {/* 3. Arah Angin (Wind Direction) Card with Animated Compass */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/60 tracking-wider uppercase mb-1">
                          <Compass className="w-4 h-4 text-cyan-300" />
                          <span>Arah Angin</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-10 h-10 rounded-full border border-white/30 bg-black/25 flex items-center justify-center relative shadow-inner">
                            <Navigation 
                              className="w-5 h-5 text-cyan-300 fill-cyan-300 transition-transform duration-500"
                              style={{ transform: `rotate(${windDirInfo.rotation}deg)` }}
                            />
                          </div>
                          <div>
                            <div className="text-base font-semibold text-white">
                              {windDirInfo.cardinal} ({Math.round(windDirection)}°)
                            </div>
                            <div className="text-xs text-white/60">
                              {windDirInfo.label}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-white/75 mt-3 leading-relaxed">
                        Kecepatan angin {current.wind_speed_10m} km/j dengan hembusan maksimum {windMaxDaily} km/j.
                      </div>
                    </div>

                    {/* 4. Jarak Pandang (Visibility) Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/60 tracking-wider uppercase mb-1">
                          <Eye className="w-4 h-4 text-blue-300" />
                          <span>Jarak Pandang</span>
                        </div>
                        <div className="text-3xl font-light text-white mt-1 flex items-baseline gap-1.5">
                          <span>{visibilityInfo.km}</span>
                          <span className="text-sm font-normal text-white/70">km</span>
                        </div>
                      </div>
                      <div className="text-xs text-white/75 mt-3 leading-relaxed">
                        <span className="font-semibold text-white/90">{visibilityInfo.label}.</span> {visibilityInfo.status}
                      </div>
                    </div>

                    {/* 5. Tekanan Udara (Atmospheric Pressure) Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/60 tracking-wider uppercase mb-1">
                          <Gauge className="w-4 h-4 text-emerald-300" />
                          <span>Tekanan Udara</span>
                        </div>
                        <div className="text-3xl font-light text-white mt-1 flex items-baseline gap-1.5">
                          <span>{Math.round(surfacePressure)}</span>
                          <span className="text-sm font-normal text-white/70">hPa</span>
                        </div>
                      </div>
                      <div className="text-xs text-white/75 mt-3 leading-relaxed">
                        <span className="font-semibold text-white/90">{pressureInfo.label}.</span> {pressureInfo.status}
                      </div>
                    </div>

                    {/* 6. Titik Embun (Dew Point) Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/60 tracking-wider uppercase mb-1">
                          <Droplets className="w-4 h-4 text-sky-300" />
                          <span>Titik Embun</span>
                        </div>
                        <div className="text-3xl font-light text-white mt-1">
                          {dewPoint.toFixed(1)}°C
                        </div>
                      </div>
                      <div className="text-xs text-white/75 mt-3 leading-relaxed">
                        Suhu di mana uap air atmosfer mengembun. Menandakan tingkat kelembapan absolut di udara.
                      </div>
                    </div>

                    {/* 7. Curah Hujan (Rainfall) Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/60 tracking-wider uppercase mb-1">
                          <CloudRain className="w-4 h-4 text-cyan-300" />
                          <span>Curah Hujan</span>
                        </div>
                        <div className="text-3xl font-light text-white mt-1 flex items-baseline gap-1.5">
                          <span>{current.precipitation}</span>
                          <span className="text-sm font-normal text-white/70">mm</span>
                        </div>
                      </div>
                      <div className="text-xs text-white/75 mt-3 leading-relaxed">
                        Akumulasi harian diperkirakan mencapai {rainSumDaily} mm. Peluang presipitasi maksimum hari ini sebesar {rainProbMaxDaily}%.
                      </div>
                    </div>

                    {/* 8. Kelembapan Udara (Humidity) Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/60 tracking-wider uppercase mb-1">
                          <Droplets className="w-4 h-4 text-sky-300" />
                          <span>Kelembapan Udara</span>
                        </div>
                        <div className="text-3xl font-light text-white mt-1">
                          {current.relative_humidity_2m}%
                        </div>
                      </div>
                      <div className="text-xs text-white/75 mt-3 leading-relaxed">
                        Kadar uap air relatif saat ini di stasiun pengamatan {selectedLocation.name}.
                      </div>
                    </div>

                  </div>

                </div>

                {/* 4. Weather Summary & BMKG Insights Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-white/80 font-bold tracking-wider uppercase text-[11px]">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Laporan Meteorologi &amp; Pantauan Cuaca Weathy</span>
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed">
                    Stasiun pengamatan pada koordinat {selectedLocation.latitude}, {selectedLocation.longitude} ({selectedLocation.name}, {selectedLocation.region}) melaporkan kondisi {conditionInfo.label} dengan suhu udara {curTemp.toFixed(1)}°C, kelembapan {current.relative_humidity_2m}%, serta angin bertiup dengan kecepatan {current.wind_speed_10m} km/j. Waktu pengamatan lokal tercatat pada {current.time.replace('T', ' ')} WIB.
                  </p>
                </div>
              </>
            )}

          </main>

        </div>

      </div>

    </div>
  );
};
