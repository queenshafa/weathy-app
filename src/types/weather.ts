export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature?: string;
  wind_speed_10m: string;
  wind_direction_10m?: string;
  precipitation: string;
  surface_pressure?: string;
  weather_code: string;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature?: number;
  wind_speed_10m: number;
  wind_direction_10m?: number;
  precipitation: number;
  surface_pressure?: number;
  weather_code: number;
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature?: string;
  dew_point_2m?: string;
  precipitation_probability: string;
  precipitation: string;
  surface_pressure?: string;
  visibility?: string;
  wind_direction_10m?: string;
  uv_index?: string;
  weather_code: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature?: number[];
  dew_point_2m?: number[];
  precipitation_probability: number[];
  precipitation: number[];
  surface_pressure?: number[];
  visibility?: number[];
  wind_direction_10m?: number[];
  uv_index?: number[];
  weather_code: number[];
}

export interface DailyUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
  precipitation_probability_max: string;
  wind_speed_10m_max: string;
  uv_index_max?: string;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  uv_index_max?: number[];
}

export interface WeatherModel {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: CurrentWeather;
  hourly_units: HourlyUnits;
  hourly: HourlyWeather;
  daily_units: DailyUnits;
  daily: DailyWeather;
}

// Open-Meteo & WMO Weather Code Info
export interface WeatherConditionInfo {
  code: number;
  label: string;
  bmkgEquivalent: string;
  iconName: string;
  color: string;
}

export function getWeatherCondition(code: number): WeatherConditionInfo {
  switch (code) {
    case 0:
      return { code, label: 'Cerah', bmkgEquivalent: 'Cerah', iconName: 'sun', color: '#F59E0B' };
    case 1:
      return { code, label: 'Sebagian Besar Cerah', bmkgEquivalent: 'Cerah Berawan', iconName: 'cloud-sun', color: '#3B82F6' };
    case 2:
      return { code, label: 'Cerah Berawan', bmkgEquivalent: 'Cerah Berawan', iconName: 'cloud-sun', color: '#3B82F6' };
    case 3:
      return { code, label: 'Berawan Tebal', bmkgEquivalent: 'Berawan Tebal', iconName: 'cloud', color: '#64748B' };
    case 45:
    case 48:
      return { code, label: 'Berkabut', bmkgEquivalent: 'Kabut / Asap', iconName: 'cloud-fog', color: '#94A3B8' };
    case 51:
    case 53:
    case 55:
      return { code, label: 'Gerimis', bmkgEquivalent: 'Hujan Ringan', iconName: 'cloud-drizzle', color: '#0EA5E9' };
    case 61:
    case 63:
    case 65:
      return { code, label: 'Hujan', bmkgEquivalent: 'Hujan Sedang', iconName: 'cloud-rain', color: '#2563EB' };
    case 71:
    case 73:
    case 75:
      return { code, label: 'Hujan Salju / Es', bmkgEquivalent: 'Hujan Es', iconName: 'cloud-snow', color: '#60A5FA' };
    case 80:
    case 81:
    case 82:
      return { code, label: 'Hujan Lebat', bmkgEquivalent: 'Hujan Lebat', iconName: 'cloud-rain', color: '#1D4ED8' };
    case 95:
    case 96:
    case 99:
      return { code, label: 'Hujan Petir', bmkgEquivalent: 'Hujan Petir', iconName: 'cloud-lightning', color: '#7C3AED' };
    default:
      return { code, label: 'Berawan Sebagian', bmkgEquivalent: 'Cerah Berawan', iconName: 'cloud-sun', color: '#3B82F6' };
  }
}

// 1. UV Index Helper
export function getUvCategory(uv: number): { label: string; risk: string; color: string; advice: string } {
  if (uv < 3) {
    return { label: 'Rendah', risk: 'Aman', color: 'text-emerald-400', advice: 'Tidak memerlukan perlindungan khusus.' };
  }
  if (uv < 6) {
    return { label: 'Sedang', risk: 'Perlindungan Diperlukan', color: 'text-amber-300', advice: 'Gunakan kacamata hitam dan pakaian pelindung.' };
  }
  if (uv < 8) {
    return { label: 'Tinggi', risk: 'Risiko Kerusakan', color: 'text-orange-400', advice: 'Gunakan tabir surya SPF 30+ dan topi.' };
  }
  if (uv < 11) {
    return { label: 'Sangat Tinggi', risk: 'Bahaya Tinggi', color: 'text-rose-400', advice: 'Hindari paparan sinar matahari langsung siang hari.' };
  }
  return { label: 'Ekstrem', risk: 'Bahaya Ekstrem', color: 'text-purple-400', advice: 'Sebaiknya tetap berada di dalam ruangan.' };
}

// 2. Wind Direction Compass Helper
export function getWindDirectionInfo(deg: number): { cardinal: string; label: string; rotation: number } {
  const directions = [
    { cardinal: 'U', label: 'Utara' },
    { cardinal: 'UTL', label: 'Utara Timur Laut' },
    { cardinal: 'TL', label: 'Timur Laut' },
    { cardinal: 'TTL', label: 'Timur Timur Laut' },
    { cardinal: 'T', label: 'Timur' },
    { cardinal: 'TTG', label: 'Timur Tenggara' },
    { cardinal: 'TG', label: 'Tenggara' },
    { cardinal: 'STG', label: 'Selatan Tenggara' },
    { cardinal: 'S', label: 'Selatan' },
    { cardinal: 'SBD', label: 'Selatan Barat Daya' },
    { cardinal: 'BD', label: 'Barat Daya' },
    { cardinal: 'BBD', label: 'Barat Barat Daya' },
    { cardinal: 'B', label: 'Barat' },
    { cardinal: 'BBL', label: 'Barat Barat Laut' },
    { cardinal: 'BL', label: 'Barat Laut' },
    { cardinal: 'UBL', label: 'Utara Barat Laut' }
  ];
  const index = Math.round(deg / 22.5) % 16;
  return {
    cardinal: directions[index].cardinal,
    label: directions[index].label,
    rotation: deg
  };
}

// 3. Visibility Helper
export function getVisibilityInfo(meters: number): { km: string; label: string; status: string } {
  const km = (meters / 1000).toFixed(1);
  if (meters >= 10000) {
    return { km, label: 'Sempurna', status: 'Jarak pandang sangat jernih dan bebas hambatan.' };
  }
  if (meters >= 5000) {
    return { km, label: 'Baik', status: 'Jarak pandang baik untuk berkendara.' };
  }
  if (meters >= 2000) {
    return { km, label: 'Sedang', status: 'Terdapat kabut tipis atau partikel uap air.' };
  }
  return { km, label: 'Buruk / Berkabut', status: 'Kabut tebal, kurangi kecepatan saat berkendara.' };
}

// 4. Atmospheric Pressure Helper
export function getPressureInfo(hPa: number): { label: string; status: string } {
  if (hPa > 1013) {
    return { label: 'Tinggi', status: 'Kondisi atmosfer tenang dan stabil.' };
  }
  if (hPa >= 1005) {
    return { label: 'Normal', status: 'Tekanan atmosfer standar permukaan laut.' };
  }
  return { label: 'Rendah', status: 'Potensi terbentuknya awan konvektif dan hujan.' };
}
