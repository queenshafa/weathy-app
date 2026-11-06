import { WeatherModel } from '../types/weather';

export interface IndonesianLocation {
  name: string;
  region: string;
  island: 'Sumatera' | 'Jawa' | 'Bali & Nusa Tenggara' | 'Kalimantan' | 'Sulawesi' | 'Maluku & Papua';
  latitude: number;
  longitude: number;
}

export const SAMPLE_CUACAKITA_DATA: WeatherModel = {
  "latitude": -6.2088,
  "longitude": 106.8456,
  "generationtime_ms": 0.28,
  "utc_offset_seconds": 25200,
  "timezone": "Asia/Jakarta",
  "timezone_abbreviation": "GMT+7",
  "elevation": 10.0,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "apparent_temperature": "°C",
    "wind_speed_10m": "km/h",
    "wind_direction_10m": "°",
    "surface_pressure": "hPa",
    "precipitation": "mm",
    "weather_code": "wmo code"
  },
  "current": {
    "time": "2026-11-02T13:00",
    "interval": 900,
    "temperature_2m": 31.8,
    "relative_humidity_2m": 65,
    "apparent_temperature": 34.6,
    "wind_speed_10m": 16.5,
    "wind_direction_10m": 135,
    "surface_pressure": 1012.3,
    "precipitation": 0.0,
    "weather_code": 0 // 0 = Cerah (Clear sky)
  },
  "hourly_units": {
    "time": "iso8601",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "apparent_temperature": "°C",
    "dew_point_2m": "°C",
    "precipitation_probability": "%",
    "precipitation": "mm",
    "surface_pressure": "hPa",
    "visibility": "m",
    "wind_direction_10m": "°",
    "uv_index": "",
    "weather_code": "wmo code"
  },
  "hourly": {
    "time": [
      "2026-11-02T00:00", "2026-11-02T01:00", "2026-11-02T02:00", "2026-11-02T03:00",
      "2026-11-02T04:00", "2026-11-02T05:00", "2026-11-02T06:00", "2026-11-02T07:00",
      "2026-11-02T08:00", "2026-11-02T09:00", "2026-11-02T10:00", "2026-11-02T11:00",
      "2026-11-02T12:00", "2026-11-02T13:00", "2026-11-02T14:00", "2026-11-02T15:00",
      "2026-11-02T16:00", "2026-11-02T17:00", "2026-11-02T18:00", "2026-11-02T19:00",
      "2026-11-02T20:00", "2026-11-02T21:00", "2026-11-02T22:00", "2026-11-02T23:00"
    ],
    "temperature_2m": [
      25.4, 25.1, 25.0, 24.8, 24.7, 25.0, 26.2, 28.1,
      29.8, 31.4, 32.8, 33.5, 33.8, 31.8, 30.6, 28.5,
      27.8, 27.2, 26.8, 26.5, 26.2, 25.9, 25.7, 25.5
    ],
    "relative_humidity_2m": [
      88, 90, 92, 93, 94, 91, 84, 76,
      68, 62, 57, 54, 52, 65, 76, 84,
      87, 89, 90, 92, 92, 93, 93, 94
    ],
    "apparent_temperature": [
      27.2, 26.8, 26.7, 26.4, 26.3, 26.8, 28.5, 30.9,
      32.8, 34.6, 36.1, 37.0, 37.2, 34.6, 33.2, 30.8,
      29.9, 29.2, 28.6, 28.2, 27.9, 27.6, 27.4, 27.1
    ],
    "dew_point_2m": [
      23.2, 23.4, 23.6, 23.6, 23.6, 23.4, 23.3, 23.5,
      23.2, 23.4, 23.2, 23.1, 22.8, 24.2, 24.6, 24.5,
      24.4, 24.2, 24.0, 23.9, 23.7, 23.6, 23.5, 23.4
    ],
    "precipitation_probability": [
      10, 8, 5, 5, 2, 0, 0, 5,
      12, 20, 35, 45, 60, 40, 70, 55,
      35, 25, 20, 15, 12, 10, 8, 5
    ],
    "precipitation": [
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.2, 0.5, 0.8, 0.0, 1.2, 0.6,
      0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ],
    "surface_pressure": [
      1010.5, 1010.2, 1010.0, 1009.8, 1010.1, 1010.8, 1011.6, 1012.3,
      1012.8, 1013.1, 1012.9, 1012.4, 1011.8, 1012.3, 1011.5, 1011.0,
      1011.2, 1011.8, 1012.4, 1012.9, 1013.2, 1012.8, 1012.2, 1011.5
    ],
    "visibility": [
      10000, 10000, 9500, 9000, 9000, 10000, 12000, 15000,
      18000, 20000, 20000, 20000, 18000, 16000, 14000, 12000,
      12000, 11000, 10000, 10000, 10000, 10000, 10000, 10000
    ],
    "wind_direction_10m": [
      140, 138, 135, 132, 130, 132, 135, 138,
      142, 145, 140, 138, 135, 135, 132, 130,
      128, 130, 132, 135, 138, 140, 142, 140
    ],
    "uv_index": [
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.4, 1.8,
      4.2, 7.1, 9.4, 10.2, 9.8, 8.5, 6.2, 3.4,
      1.2, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ],
    "weather_code": [
      1, 1, 1, 1, 2, 1, 0, 0,
      0, 1, 2, 2, 61, 0, 61, 51,
      2, 1, 1, 1, 1, 2, 2, 1
    ]
  },
  "daily_units": {
    "time": "iso8601",
    "weather_code": "wmo code",
    "temperature_2m_max": "°C",
    "temperature_2m_min": "°C",
    "precipitation_sum": "mm",
    "precipitation_probability_max": "%",
    "wind_speed_10m_max": "km/h",
    "uv_index_max": ""
  },
  "daily": {
    "time": [
      "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-07", "2026-11-08"
    ],
    "weather_code": [
      0, 2, 61, 1, 2, 80, 0
    ],
    "temperature_2m_max": [
      33.8, 32.5, 30.2, 33.1, 32.8, 31.4, 34.0
    ],
    "temperature_2m_min": [
      24.7, 24.5, 23.8, 24.2, 24.6, 23.9, 24.8
    ],
    "precipitation_sum": [
      2.5, 4.2, 12.8, 1.2, 3.4, 8.5, 0.0
    ],
    "precipitation_probability_max": [
      40, 65, 85, 30, 45, 75, 10
    ],
    "wind_speed_10m_max": [
      18.2, 15.4, 21.6, 14.1, 16.8, 22.3, 12.5
    ],
    "uv_index_max": [
      10.2, 9.4, 7.8, 10.5, 9.1, 6.4, 10.0
    ]
  }
};

/**
 * Daftar Titik Koordinat Komprehensif Wilayah & 38 Provinsi di Indonesia
 */
export const INDONESIAN_LOCATIONS: IndonesianLocation[] = [
  // --- JAWA ---
  { name: "Jakarta", region: "DKI Jakarta", island: "Jawa", latitude: -6.2088, longitude: 106.8456 },
  { name: "Bekasi", region: "Jawa Barat", island: "Jawa", latitude: -6.2383, longitude: 106.9756 },
  { name: "Bandung", region: "Jawa Barat", island: "Jawa", latitude: -6.9175, longitude: 107.6191 },
  { name: "Bogor", region: "Jawa Barat", island: "Jawa", latitude: -6.5971, longitude: 106.8060 },
  { name: "Depok", region: "Jawa Barat", island: "Jawa", latitude: -6.4025, longitude: 106.7942 },
  { name: "Tangerang", region: "Banten", island: "Jawa", latitude: -6.1783, longitude: 106.6319 },
  { name: "Serang", region: "Banten", island: "Jawa", latitude: -6.1104, longitude: 106.1640 },
  { name: "Cirebon", region: "Jawa Barat", island: "Jawa", latitude: -6.7320, longitude: 108.5523 },
  { name: "Semarang", region: "Jawa Tengah", island: "Jawa", latitude: -6.9667, longitude: 110.4167 },
  { name: "Surakarta (Solo)", region: "Jawa Tengah", island: "Jawa", latitude: -7.5755, longitude: 110.8243 },
  { name: "Yogyakarta", region: "D.I. Yogyakarta", island: "Jawa", latitude: -7.7956, longitude: 110.3695 },
  { name: "Surabaya", region: "Jawa Timur", island: "Jawa", latitude: -7.2575, longitude: 112.7521 },
  { name: "Malang", region: "Jawa Timur", island: "Jawa", latitude: -7.9797, longitude: 112.6304 },
  { name: "Banyuwangi", region: "Jawa Timur", island: "Jawa", latitude: -8.2192, longitude: 114.3692 },

  // --- SUMATERA ---
  { name: "Banda Aceh", region: "Aceh", island: "Sumatera", latitude: 5.5483, longitude: 95.3238 },
  { name: "Medan", region: "Sumatera Utara", island: "Sumatera", latitude: 3.5952, longitude: 98.6722 },
  { name: "Padang", region: "Sumatera Barat", island: "Sumatera", latitude: -0.9471, longitude: 100.4172 },
  { name: "Pekanbaru", region: "Riau", island: "Sumatera", latitude: 0.5071, longitude: 101.4478 },
  { name: "Batam", region: "Kepulauan Riau", island: "Sumatera", latitude: 1.1301, longitude: 104.0529 },
  { name: "Tanjung Pinang", region: "Kepulauan Riau", island: "Sumatera", latitude: 0.9167, longitude: 104.4500 },
  { name: "Jambi", region: "Jambi", island: "Sumatera", latitude: -1.6101, longitude: 103.6131 },
  { name: "Palembang", region: "Sumatera Selatan", island: "Sumatera", latitude: -2.9761, longitude: 104.7754 },
  { name: "Bengkulu", region: "Bengkulu", island: "Sumatera", latitude: -3.8004, longitude: 102.2655 },
  { name: "Bandar Lampung", region: "Lampung", island: "Sumatera", latitude: -5.4500, longitude: 105.2667 },
  { name: "Pangkal Pinang", region: "Bangka Belitung", island: "Sumatera", latitude: -2.1333, longitude: 106.1167 },

  // --- BALI & NUSA TENGGARA ---
  { name: "Denpasar", region: "Bali", island: "Bali & Nusa Tenggara", latitude: -8.6705, longitude: 115.2126 },
  { name: "Singaraja", region: "Bali", island: "Bali & Nusa Tenggara", latitude: -8.1120, longitude: 115.0882 },
  { name: "Mataram (Lombok)", region: "Nusa Tenggara Barat", island: "Bali & Nusa Tenggara", latitude: -8.5833, longitude: 116.1167 },
  { name: "Bima", region: "Nusa Tenggara Barat", island: "Bali & Nusa Tenggara", latitude: -8.4608, longitude: 118.7267 },
  { name: "Kupang", region: "Nusa Tenggara Timur", island: "Bali & Nusa Tenggara", latitude: -10.1772, longitude: 123.6070 },
  { name: "Labuan Bajo", region: "Nusa Tenggara Timur", island: "Bali & Nusa Tenggara", latitude: -8.4964, longitude: 119.8877 },
  { name: "Ende", region: "Nusa Tenggara Timur", island: "Bali & Nusa Tenggara", latitude: -8.8432, longitude: 121.6623 },

  // --- KALIMANTAN ---
  { name: "Pontianak", region: "Kalimantan Barat", island: "Kalimantan", latitude: -0.0263, longitude: 109.3425 },
  { name: "Palangka Raya", region: "Kalimantan Tengah", island: "Kalimantan", latitude: -2.2161, longitude: 113.9167 },
  { name: "Banjarmasin", region: "Kalimantan Selatan", island: "Kalimantan", latitude: -3.3194, longitude: 114.5908 },
  { name: "Samarinda", region: "Kalimantan Timur", island: "Kalimantan", latitude: -0.5022, longitude: 117.1536 },
  { name: "Balikpapan", region: "Kalimantan Timur", island: "Kalimantan", latitude: -1.2379, longitude: 116.8289 },
  { name: "Nusantara (IKN)", region: "Kalimantan Timur", island: "Kalimantan", latitude: -0.9739, longitude: 116.7088 },
  { name: "Tanjung Selor", region: "Kalimantan Utara", island: "Kalimantan", latitude: 2.8375, longitude: 117.3653 },
  { name: "Tarakan", region: "Kalimantan Utara", island: "Kalimantan", latitude: 3.3274, longitude: 117.5786 },

  // --- SULAWESI ---
  { name: "Manado", region: "Sulawesi Utara", island: "Sulawesi", latitude: 1.4748, longitude: 124.8428 },
  { name: "Gorontalo", region: "Gorontalo", island: "Sulawesi", latitude: 0.5435, longitude: 123.0568 },
  { name: "Palu", region: "Sulawesi Tengah", island: "Sulawesi", latitude: -0.9003, longitude: 119.8779 },
  { name: "Mamuju", region: "Sulawesi Barat", island: "Sulawesi", latitude: -2.6748, longitude: 118.8888 },
  { name: "Makassar", region: "Sulawesi Selatan", island: "Sulawesi", latitude: -5.1477, longitude: 119.4327 },
  { name: "Kendari", region: "Sulawesi Tenggara", island: "Sulawesi", latitude: -3.9985, longitude: 122.5126 },
  { name: "Bau-Bau", region: "Sulawesi Tenggara", island: "Sulawesi", latitude: -5.4632, longitude: 122.6022 },

  // --- MALUKU & PAPUA ---
  { name: "Ambon", region: "Maluku", island: "Maluku & Papua", latitude: -3.6547, longitude: 128.1906 },
  { name: "Ternate", region: "Maluku Utara", island: "Maluku & Papua", latitude: 0.7904, longitude: 127.3820 },
  { name: "Sofifi", region: "Maluku Utara", island: "Maluku & Papua", latitude: 0.7417, longitude: 127.5750 },
  { name: "Jayapura", region: "Papua", island: "Maluku & Papua", latitude: -2.5916, longitude: 140.6690 },
  { name: "Manokwari", region: "Papua Barat", island: "Maluku & Papua", latitude: -0.8615, longitude: 134.0620 },
  { name: "Sorong", region: "Papua Barat Daya", island: "Maluku & Papua", latitude: -0.8762, longitude: 131.2558 },
  { name: "Nabire", region: "Papua Tengah", island: "Maluku & Papua", latitude: -3.3667, longitude: 135.5000 },
  { name: "Wamena", region: "Papua Pegunungan", island: "Maluku & Papua", latitude: -4.0988, longitude: 138.9444 },
  { name: "Merauke", region: "Papua Selatan", island: "Maluku & Papua", latitude: -8.4991, longitude: 140.4018 }
];
