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
  Menu,
  X,
  Search,
  Compass,
  Check,
  Sparkles,
  Zap,
  Leaf,
  Eye,
  Gauge
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

interface FlutterSimulatorProps {
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

export const FlutterSimulator: React.FC<FlutterSimulatorProps> = ({ onSelectCodeTab }) => {
  const [selectedLocation, setSelectedLocation] = useState<IndonesianLocation>(INDONESIAN_LOCATIONS[0]);
  const [isCurrentGpsLocation, setIsCurrentGpsLocation] = useState(false);
  const [simulatedState, setSimulatedState] = useState<'data' | 'loading' | 'error'>('data');
  const [useLiveApi, setUseLiveApi] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherModel>(SAMPLE_CUACAKITA_DATA);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCitySheet, setShowCitySheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionTab, setSelectedRegionTab] = useState<string>('Semua');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [atmosphereOverride, setAtmosphereOverride] = useState<WeatherEffectType>('auto');

  // Fetch data from Open-Meteo based on latitude & longitude
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

  // Browser Geolocation integration to simulate GPS detection
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
          setShowCitySheet(false);
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
          setShowCitySheet(false);
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
      setShowCitySheet(false);
      setGpsLoading(false);
    }
  };

  const handleSelectCity = (loc: IndonesianLocation) => {
    setSelectedLocation(loc);
    setIsCurrentGpsLocation(false);
    setShowCitySheet(false);
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

  // Calculation for Apple Weather 7-Day Min-Max Bar
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

  // Filter cities for search and region tab
  const filteredCities = INDONESIAN_LOCATIONS.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = 
      selectedRegionTab === 'Semua' || c.island === selectedRegionTab;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center max-w-6xl mx-auto">
      
      {/* Phone Mockup Frame */}
      <div className="w-full max-w-[390px] mx-auto bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 relative">
        
        {/* Notch / Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2 z-30 shadow-inner pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
          <div className="w-8 h-1 rounded-full bg-slate-800" />
        </div>

        {/* Device Screen - Atmospheric Apple Sky Gradient */}
        <div className="bg-gradient-to-b from-[#2C5E8A] via-[#1E3A5F] to-[#122438] rounded-[38px] overflow-hidden flex flex-col h-[780px] text-white font-sans border border-slate-700/40 relative shadow-inner select-none">
          
          {/* Atmospheric Adaptive Weather Effects (Canvas Particles for Sun God-rays, Rain drops, Wind Leaves, Thunderstorm) */}
          <WeatherAtmosphereEffect
            weatherCode={current.weather_code ?? 0}
            windSpeed={current.wind_speed_10m}
            precipitation={current.precipitation}
            overrideEffect={atmosphereOverride}
          />

          {/* Top Status Bar (Clean Apple Weather Style) */}
          <div className="pt-8 px-6 flex items-center justify-between text-xs text-white/80 z-20">
            <span className="font-semibold text-[13px]">
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="flex items-center">
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
                title="Perbarui Cuaca"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching || simulatedState === 'loading' ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Scrollable Dashboard Body */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-3 text-white no-scrollbar relative z-20">
            
            {/* Riverpod State Handler */}
            {simulatedState === 'loading' ? (
              /* Loading Skeleton */
              <div className="space-y-4 pt-6 animate-pulse">
                <div className="text-center space-y-2">
                  <div className="h-6 w-32 bg-white/20 rounded-full mx-auto" />
                  <div className="h-16 w-24 bg-white/20 rounded-2xl mx-auto" />
                  <div className="h-4 w-40 bg-white/20 rounded-full mx-auto" />
                </div>
                <div className="h-32 bg-white/10 rounded-3xl" />
                <div className="h-60 bg-white/10 rounded-3xl" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-28 bg-white/10 rounded-3xl" />
                  <div className="h-28 bg-white/10 rounded-3xl" />
                </div>
              </div>
            ) : simulatedState === 'error' ? (
              /* Error View with Retry */
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/15 text-center flex flex-col items-center justify-center my-16 shadow-xl">
                <AlertTriangle className="w-10 h-10 text-amber-300 mb-3 stroke-[1.5]" />
                <h3 className="font-semibold text-white text-base mb-1">
                  Gagal Memuat Cuaca
                </h3>
                <p className="text-xs text-white/70 mb-5 max-w-[240px] leading-relaxed">
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
              /* Data Success State - Authentic Apple Weather Style */
              <>
                {/* 1. Apple Weather Minimalist Centered Hero */}
                <div className="text-center pt-2 pb-3">
                  <div className="flex items-center justify-center gap-1.5 text-white/95">
                    {isCurrentGpsLocation && (
                      <Navigation className="w-3.5 h-3.5 fill-white text-white rotate-45" />
                    )}
                    <h2 className="text-2xl font-normal tracking-wide drop-shadow-sm">
                      {selectedLocation.name}
                    </h2>
                  </div>
                  
                  {/* Realtime Live Temperature */}
                  <div className="text-7xl font-extralight tracking-tighter text-white my-0.5 ml-3 drop-shadow-md">
                    {Math.round(curTemp)}°
                  </div>
                  
                  {/* Weather Condition */}
                  <div className="text-sm font-medium text-white/90 drop-shadow-sm capitalize">
                    {conditionInfo.label}
                  </div>
                  
                  {/* High and Low */}
                  <div className="text-xs font-normal text-white/75 mt-0.5 space-x-2">
                    <span>T:{Math.round(maxTempDaily)}°</span>
                    <span>R:{Math.round(minTempDaily)}°</span>
                  </div>
                </div>

                {/* 2. Apple Weather 24-Hour Horizontal Forecast */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg">
                  <div className="text-[11px] font-medium text-white/70 tracking-wide uppercase mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-white/60" />
                    <span>Prakiraan Per Jam</span>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar text-center">
                    {hourly.time.slice(0, 14).map((t, idx) => {
                      const hourOnly = t.split('T')[1].substring(0, 5);
                      const isNow = idx === 0;
                      const temp = Math.round(hourly.temperature_2m[idx]);
                      const code = hourly.weather_code[idx];
                      const rainProb = hourly.precipitation_probability[idx];

                      return (
                        <div key={idx} className="min-w-[46px] flex flex-col items-center justify-between gap-1.5 py-0.5">
                          <span className="text-[11px] font-medium text-white/80">
                            {isNow ? 'Kini' : hourOnly}
                          </span>
                          <div className="my-1">
                            {renderWeatherIcon(code, "w-5 h-5")}
                          </div>
                          {rainProb > 0 ? (
                            <span className="text-[10px] text-cyan-300 font-semibold">
                              {rainProb}%
                            </span>
                          ) : (
                            <div className="h-3.5" />
                          )}
                          <span className="text-xs font-semibold text-white">
                            {temp}°
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Apple Weather Signature 7-Day Forecast with Colored Range Bars */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg">
                  <div className="text-[11px] font-medium text-white/70 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-white/60" />
                    <span>Prakiraan 7 Hari</span>
                  </div>

                  <div className="divide-y divide-white/10">
                    {daily.time.map((date, idx) => {
                      const code = daily.weather_code[idx];
                      const maxT = Math.round(daily.temperature_2m_max[idx]);
                      const minT = Math.round(daily.temperature_2m_min[idx]);
                      const isToday = idx === 0;
                      const dayName = isToday 
                        ? 'Hari Ini' 
                        : new Date(date).toLocaleDateString('id-ID', { weekday: 'short' });

                      // Range bar calculations relative to weekly min & max
                      const leftPercent = Math.max(0, ((daily.temperature_2m_min[idx] - allWeeklyMin) / weeklyRange) * 100);
                      const rightPercent = Math.min(100, ((daily.temperature_2m_max[idx] - allWeeklyMin) / weeklyRange) * 100);
                      const barWidth = Math.max(10, rightPercent - leftPercent);
                      const curTempPos = Math.max(0, Math.min(100, ((curTemp - allWeeklyMin) / weeklyRange) * 100));

                      return (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          {/* Day */}
                          <span className={`w-14 truncate ${isToday ? 'font-semibold text-white' : 'text-white/80'}`}>
                            {dayName}
                          </span>

                          {/* Icon */}
                          <div className="w-8 flex justify-center">
                            {renderWeatherIcon(code, "w-4 h-4")}
                          </div>

                          {/* Min Temp */}
                          <span className="w-7 text-right text-white/60 font-medium">
                            {minT}°
                          </span>

                          {/* Apple signature colored range bar */}
                          <div className="flex-1 mx-3 h-1 bg-black/25 rounded-full relative overflow-hidden">
                            <div 
                              className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-amber-300 to-orange-400"
                              style={{
                                left: `${leftPercent}%`,
                                width: `${barWidth}%`
                              }}
                            />
                            {/* Current temperature indicator dot for today */}
                            {isToday && (
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-slate-900 shadow-sm"
                                style={{ left: `calc(${curTempPos}% - 4px)` }}
                              />
                            )}
                          </div>

                          {/* Max Temp */}
                          <span className="w-7 text-left text-white font-semibold">
                            {maxT}°
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Apple Weather Bento Cards — Parameter Tambahan Lengkap */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* 1. UV INDEX BENTO */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/60 tracking-wider uppercase mb-1">
                        <Sun className="w-3.5 h-3.5 text-amber-300" />
                        <span>Indeks UV</span>
                      </div>
                      <div className="text-2xl font-light tracking-tight text-white mt-0.5 flex items-baseline gap-1.5">
                        <span>{uvIndex.toFixed(1)}</span>
                        <span className={`text-[11px] font-semibold ${uvCategory.color}`}>
                          {uvCategory.label}
                        </span>
                      </div>
                    </div>
                    {/* Visual UV Track Bar */}
                    <div className="mt-2">
                      <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 via-orange-400 to-purple-500 relative overflow-hidden">
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-slate-900 shadow-sm"
                          style={{ left: `calc(${Math.min(100, (uvIndex / 12) * 100)}% - 4px)` }}
                        />
                      </div>
                      <div className="text-[10px] text-white/70 mt-1.5 leading-tight">
                        {uvCategory.advice}
                      </div>
                    </div>
                  </div>

                  {/* 2. APPARENT TEMPERATURE (SUHU TERASA) BENTO */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/60 tracking-wider uppercase mb-1">
                        <Thermometer className="w-3.5 h-3.5 text-amber-300" />
                        <span>Suhu Terasa</span>
                      </div>
                      <div className="text-2xl font-light tracking-tight text-white mt-0.5">
                        {Math.round(apparentTemp)}°
                      </div>
                    </div>
                    <div className="text-[10px] text-white/75 mt-2 leading-tight">
                      {apparentTemp > curTemp 
                        ? `Terasa ${(apparentTemp - curTemp).toFixed(1)}° lebih hangat akibat kelembapan ${current.relative_humidity_2m}%.` 
                        : 'Suhu terasa serupa dengan suhu aktual.'}
                    </div>
                  </div>

                  {/* 3. WIND DIRECTION (ARAH ANGIN) BENTO */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/60 tracking-wider uppercase mb-1">
                        <Compass className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Arah Angin</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Interactive Compass Disc */}
                        <div className="w-8 h-8 rounded-full border border-white/30 bg-black/20 flex items-center justify-center relative">
                          <Navigation 
                            className="w-4 h-4 text-cyan-300 fill-cyan-300 transition-transform duration-500"
                            style={{ transform: `rotate(${windDirInfo.rotation}deg)` }}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {windDirInfo.cardinal} ({Math.round(windDirection)}°)
                          </div>
                          <div className="text-[10px] text-white/60">
                            {windDirInfo.label}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-white/75 mt-2 leading-tight">
                      Kecepatan {current.wind_speed_10m} km/j (hembusan {windMaxDaily} km/j).
                    </div>
                  </div>

                  {/* 4. VISIBILITY (JARAK PANDANG) BENTO */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/60 tracking-wider uppercase mb-1">
                        <Eye className="w-3.5 h-3.5 text-blue-300" />
                        <span>Jarak Pandang</span>
                      </div>
                      <div className="text-2xl font-light tracking-tight text-white mt-0.5 flex items-baseline gap-1">
                        <span>{visibilityInfo.km}</span>
                        <span className="text-xs text-white/70">km</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-white/75 mt-2 leading-tight">
                      <span className="font-semibold text-white/90">{visibilityInfo.label}.</span> {visibilityInfo.status}
                    </div>
                  </div>

                  {/* 5. ATMOSPHERIC PRESSURE (TEKANAN UDARA) BENTO */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/60 tracking-wider uppercase mb-1">
                        <Gauge className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Tekanan Udara</span>
                      </div>
                      <div className="text-2xl font-light tracking-tight text-white mt-0.5 flex items-baseline gap-1">
                        <span>{Math.round(surfacePressure)}</span>
                        <span className="text-xs text-white/70">hPa</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-white/75 mt-2 leading-tight">
                      <span className="font-semibold text-white/90">{pressureInfo.label}.</span> {pressureInfo.status}
                    </div>
                  </div>

                  {/* 6. DEW POINT (TITIK EMBUN) BENTO */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/60 tracking-wider uppercase mb-1">
                        <Droplets className="w-3.5 h-3.5 text-sky-300" />
                        <span>Titik Embun</span>
                      </div>
                      <div className="text-2xl font-light tracking-tight text-white mt-0.5">
                        {dewPoint.toFixed(1)}°C
                      </div>
                    </div>
                    <div className="text-[10px] text-white/75 mt-2 leading-tight">
                      Suhu kondensasi uap air. Semakin tinggi nilainya, udara terasa semakin lembap.
                    </div>
                  </div>

                  {/* 7. CURAH HUJAN BENTO */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/60 tracking-wider uppercase mb-1">
                        <CloudRain className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Curah Hujan</span>
                      </div>
                      <div className="text-2xl font-light tracking-tight text-white mt-0.5">
                        {current.precipitation} <span className="text-xs font-normal text-white/70">mm</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-white/75 mt-2 leading-tight">
                      Total harian {rainSumDaily} mm. Peluang hujan puncak {rainProbMaxDaily}%.
                    </div>
                  </div>

                  {/* 8. KELEMBAPAN UDARA BENTO */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/60 tracking-wider uppercase mb-1">
                        <Droplets className="w-3.5 h-3.5 text-sky-300" />
                        <span>Kelembapan Udara</span>
                      </div>
                      <div className="text-2xl font-light tracking-tight text-white mt-0.5">
                        {current.relative_humidity_2m}%
                      </div>
                    </div>
                    <div className="text-[10px] text-white/75 mt-2 leading-tight">
                      Kadar kelembapan atmosfer tropis tipikal kepulauan Indonesia.
                    </div>
                  </div>

                </div>

                {/* 5. Weather Insights Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 shadow-lg text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-semibold tracking-wider uppercase">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Ringkasan Cuaca &amp; Koordinat</span>
                  </div>
                  <p className="text-[11px] text-white/85 leading-relaxed pt-0.5">
                    Kondisi di {selectedLocation.name} ({selectedLocation.latitude}, {selectedLocation.longitude}) terpantau {conditionInfo.label} dengan suhu {curTemp.toFixed(1)}°C dan angin {current.wind_speed_10m} km/j.
                  </p>
                </div>

                <div className="h-6" />
              </>
            )}

          </div>

          {/* Apple Weather Bottom Bar (Location GPS & City Switcher Sheet) */}
          <div className="bg-[#122438]/85 backdrop-blur-lg border-t border-white/10 px-6 py-2.5 flex items-center justify-between text-white z-20">
            {/* GPS Lokasi Saat Ini Button */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={gpsLoading}
              className={`p-1.5 rounded-full transition-all flex items-center gap-1 ${
                isCurrentGpsLocation ? 'bg-white/20 text-sky-300' : 'hover:bg-white/10 text-white/80'
              }`}
              title="Gunakan Lokasi Saat Ini (GPS)"
            >
              <Navigation className={`w-4 h-4 rotate-45 ${gpsLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Apple Pagination Dots */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>

            {/* Menu Button - Open City Picker Sheet */}
            <button
              onClick={() => setShowCitySheet(true)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/80"
              title="Pilih Kota &amp; Titik Koordinat Seluruh Indonesia"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive City Picker Modal / Bottom Sheet with All 38 Provinces & Island Filters */}
          {showCitySheet && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex flex-col justify-end transition-opacity">
              <div className="bg-[#1A334E] rounded-t-[32px] border-t border-white/20 p-4 max-h-[88%] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
                
                {/* Sheet Drag Handle */}
                <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-3" />

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-base">
                      Pilih Lokasi di Indonesia
                    </h3>
                    <p className="text-[10px] text-white/60">
                      Tersedia seluruh 38 provinsi &amp; kota utama ({INDONESIAN_LOCATIONS.length} titik koordinat)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCitySheet(false)}
                    className="p-1 text-white/70 hover:text-white rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kota, provinsi, atau pulau..."
                    className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                  />
                </div>

                {/* Island / Regional Filter Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-2 mb-2 no-scrollbar">
                  {REGION_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedRegionTab(tab)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                        selectedRegionTab === tab
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Quick GPS Option */}
                <button
                  onClick={handleUseCurrentLocation}
                  disabled={gpsLoading}
                  className="w-full mb-2 p-2.5 bg-gradient-to-r from-blue-600/40 to-cyan-600/40 border border-cyan-400/30 rounded-2xl flex items-center justify-between text-left hover:bg-blue-600/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-500 rounded-xl text-white">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        Lokasi Saat Ini (GPS Sensor)
                        {isCurrentGpsLocation && (
                          <span className="text-[9px] bg-cyan-400/20 text-cyan-200 px-1.5 py-0.2 rounded-full">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/70">
                        Deteksi koordinat latitude &amp; longitude perangkat Anda
                      </div>
                    </div>
                  </div>
                  {isCurrentGpsLocation && <Check className="w-4 h-4 text-cyan-300" />}
                </button>

                {/* Comprehensive City List */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 no-scrollbar max-h-56">
                  {filteredCities.length === 0 ? (
                    <div className="text-center py-6 text-white/50 text-xs">
                      Tidak ada lokasi yang cocok dengan "{searchQuery}"
                    </div>
                  ) : (
                    filteredCities.map((city) => {
                      const isSelected = selectedLocation.name === city.name && !isCurrentGpsLocation;
                      return (
                        <button
                          key={city.name}
                          onClick={() => handleSelectCity(city)}
                          className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-colors ${
                            isSelected 
                              ? 'bg-white/20 border border-white/30 text-white' 
                              : 'bg-white/5 hover:bg-white/10 text-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-white/60 shrink-0" />
                            <div>
                              <div className="text-xs font-medium text-white flex items-center gap-1.5">
                                {city.name}
                                <span className="text-[9px] text-white/50">
                                  ({city.island})
                                </span>
                              </div>
                              <div className="text-[10px] text-white/50">
                                {city.region} • {city.latitude}, {city.longitude}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Bottom Home Indicator */}
          <div className="py-1.5 bg-[#122438] flex justify-center">
            <div className="w-24 h-1 bg-white/40 rounded-full" />
          </div>

        </div>
      </div>

      {/* Control Panel Sidebar */}
      <div className="w-full lg:w-96 space-y-4">
        
        {/* Adaptive Weather Atmospheric Effects Switcher */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Efek Cuaca Interaktif &amp; Adaptif
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulasikan partikel atmosferik langsung pada layar simulator:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAtmosphereOverride('auto')}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                atmosphereOverride === 'auto'
                  ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="font-bold">Otomatis Adaptif</div>
                <div className="text-[10px] text-slate-500 font-normal">Sesuai Open-Meteo</div>
              </div>
            </button>

            <button
              onClick={() => setAtmosphereOverride('sunny')}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                atmosphereOverride === 'sunny'
                  ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <div className="font-bold">Efek Cahaya</div>
                <div className="text-[10px] text-slate-500 font-normal">God-rays &amp; Bokeh</div>
              </div>
            </button>

            <button
              onClick={() => setAtmosphereOverride('rainy')}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                atmosphereOverride === 'rainy'
                  ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-semibold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <CloudRain className="w-4 h-4 text-cyan-600 shrink-0" />
              <div>
                <div className="font-bold">Efek Hujan</div>
                <div className="text-[10px] text-slate-500 font-normal">Hujan &amp; Cipratan</div>
              </div>
            </button>

            <button
              onClick={() => setAtmosphereOverride('windy')}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                atmosphereOverride === 'windy'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold">Angin &amp; Daun</div>
                <div className="text-[10px] text-slate-500 font-normal">Daun terbang &amp; angin</div>
              </div>
            </button>
          </div>

          <button
            onClick={() => setAtmosphereOverride('storm')}
            className={`w-full p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2.5 ${
              atmosphereOverride === 'storm'
                ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 text-yellow-500 shrink-0" />
            <div>
              <div className="font-bold">Badai Petir (Thunderstorm)</div>
              <div className="text-[10px] text-slate-500 font-normal">Hujan deras + kilat petir atmosferik</div>
            </div>
          </button>
        </div>

        {/* Settings & Indonesia Locations Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-sm text-slate-900">
              Titik Koordinat Wilayah Indonesia
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              38 Provinsi &amp; Kota Utama di 6 Gugus Kepulauan
            </p>
          </div>

          {/* GPS Quick Action */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">
              Sensor Lokasi Perangkat:
            </label>
            <button
              onClick={handleUseCurrentLocation}
              disabled={gpsLoading}
              className={`w-full py-2.5 px-3 text-xs font-medium rounded-xl flex items-center justify-center gap-2 border transition-all ${
                isCurrentGpsLocation
                  ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-xs font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isCurrentGpsLocation ? 'fill-blue-600 text-blue-600' : ''}`} />
              <span>{gpsLoading ? 'Mendeteksi Koordinat...' : 'Gunakan Lokasi Saat Ini (GPS)'}</span>
            </button>
          </div>

          {/* Quick City Dropdown */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">
              Pilih dari {INDONESIAN_LOCATIONS.length} Titik Wilayah Indonesia:
            </label>
            <select
              value={isCurrentGpsLocation ? '' : selectedLocation.name}
              onChange={(e) => {
                const found = INDONESIAN_LOCATIONS.find((r) => r.name === e.target.value);
                if (found) {
                  setSelectedLocation(found);
                  setIsCurrentGpsLocation(false);
                }
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 max-h-48"
            >
              {isCurrentGpsLocation && (
                <option value="">Lokasi Saya (GPS Terdeteksi)</option>
              )}
              {INDONESIAN_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} — {loc.region} ({loc.island})
                </option>
              ))}
            </select>
          </div>

          {/* AsyncValue State Toggle */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">
              Simulasi State AsyncValue Riverpod:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setSimulatedState('data')}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${
                  simulatedState === 'data'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Data
              </button>
              <button
                onClick={() => setSimulatedState('loading')}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${
                  simulatedState === 'loading'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Loading
              </button>
              <button
                onClick={() => {
                  setErrorMessage('WeatherException: Gagal terhubung ke Open-Meteo API');
                  setSimulatedState('error');
                }}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${
                  simulatedState === 'error'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Error
              </button>
            </div>
          </div>

          {/* Live API toggle */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-medium text-slate-800">
                Mode Live Open-Meteo API
              </div>
              <div className="text-[11px] text-slate-400">
                {useLiveApi ? 'Mengambil data online real-time' : 'Data statis offline'}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useLiveApi}
                onChange={(e) => setUseLiveApi(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* 5 Layer Quick Jump */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="text-xs font-bold text-slate-800">
            5 Layer Clean Architecture (Weathy)
          </div>
          <div className="space-y-1 text-xs">
            {[
              { name: 'weather_model.dart', layer: 'Model' },
              { name: 'weather_service.dart', layer: 'Service' },
              { name: 'weather_repository.dart', layer: 'Repository' },
              { name: 'weather_provider.dart', layer: 'Provider' },
              { name: 'weather_dashboard_widget.dart', layer: 'UI Widget' },
              { name: 'home_screen.dart', layer: 'Apple Screen' },
            ].map((f) => (
              <button
                key={f.name}
                onClick={() => onSelectCodeTab && onSelectCodeTab(f.name)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
              >
                <span className="font-mono text-slate-700 text-[11px] truncate">
                  {f.name}
                </span>
                <span className="text-[10px] text-blue-600 font-medium">
                  {f.layer}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
