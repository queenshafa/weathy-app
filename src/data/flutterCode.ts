export interface FlutterFile {
  path: string;
  name: string;
  layer: 'Model' | 'Service' | 'Repository' | 'Provider' | 'UI Widget' | 'Entrypoint' | 'Config';
  description: string;
  code: string;
}

export const FLUTTER_CODE_FILES: FlutterFile[] = [
  {
    path: 'lib/data/models/weather_model.dart',
    name: 'weather_model.dart',
    layer: 'Model',
    description: 'Data model immutable lengkap dengan factory fromJson, null safety, parsing weather_code WMO, current, hourly, dan daily.',
    code: `import 'package:flutter/foundation.dart';

/// Model utama Weathy yang memetakan seluruh respons API Open-Meteo.
/// Mendukung weather_code untuk current, hourly, dan daily.
@immutable
class WeatherModel {
  final double latitude;
  final double longitude;
  final double generationTimeMs;
  final int utcOffsetSeconds;
  final String timezone;
  final String timezoneAbbreviation;
  final double elevation;
  final CurrentUnits currentUnits;
  final CurrentWeather current;
  final HourlyUnits hourlyUnits;
  final HourlyWeather hourly;
  final DailyUnits dailyUnits;
  final DailyWeather daily;

  const WeatherModel({
    required this.latitude,
    required this.longitude,
    required this.generationTimeMs,
    required this.utcOffsetSeconds,
    required this.timezone,
    required this.timezoneAbbreviation,
    required this.elevation,
    required this.currentUnits,
    required this.current,
    required this.hourlyUnits,
    required this.hourly,
    required this.dailyUnits,
    required this.daily,
  });

  factory WeatherModel.fromJson(Map<String, dynamic> json) {
    return WeatherModel(
      latitude: _toDouble(json['latitude']),
      longitude: _toDouble(json['longitude']),
      generationTimeMs: _toDouble(json['generationtime_ms']),
      utcOffsetSeconds: _toInt(json['utc_offset_seconds']),
      timezone: json['timezone'] as String? ?? 'Asia/Jakarta',
      timezoneAbbreviation: json['timezone_abbreviation'] as String? ?? 'GMT+7',
      elevation: _toDouble(json['elevation']),
      currentUnits: CurrentUnits.fromJson(
        json['current_units'] as Map<String, dynamic>? ?? {},
      ),
      current: CurrentWeather.fromJson(
        json['current'] as Map<String, dynamic>? ?? {},
      ),
      hourlyUnits: HourlyUnits.fromJson(
        json['hourly_units'] as Map<String, dynamic>? ?? {},
      ),
      hourly: HourlyWeather.fromJson(
        json['hourly'] as Map<String, dynamic>? ?? {},
      ),
      dailyUnits: DailyUnits.fromJson(
        json['daily_units'] as Map<String, dynamic>? ?? {},
      ),
      daily: DailyWeather.fromJson(
        json['daily'] as Map<String, dynamic>? ?? {},
      ),
    );
  }

  static double _toDouble(dynamic val, [double fallback = 0.0]) {
    if (val == null) return fallback;
    if (val is double) return val;
    if (val is int) return val.toDouble();
    if (val is String) return double.tryParse(val) ?? fallback;
    return fallback;
  }

  static int _toInt(dynamic val, [int fallback = 0]) {
    if (val == null) return fallback;
    if (val is int) return val;
    if (val is double) return val.toInt();
    if (val is String) return int.tryParse(val) ?? fallback;
    return fallback;
  }
}

/// Unit pengukuran cuaca saat ini
@immutable
class CurrentUnits {
  final String time;
  final String interval;
  final String temperature2m;
  final String relativeHumidity2m;
  final String windSpeed10m;
  final String precipitation;
  final String weatherCode;

  const CurrentUnits({
    this.time = 'iso8601',
    this.interval = 'seconds',
    this.temperature2m = '°C',
    this.relativeHumidity2m = '%',
    this.windSpeed10m = 'km/h',
    this.precipitation = 'mm',
    this.weatherCode = 'wmo code',
  });

  factory CurrentUnits.fromJson(Map<String, dynamic> json) {
    return CurrentUnits(
      time: json['time'] as String? ?? 'iso8601',
      interval: json['interval'] as String? ?? 'seconds',
      temperature2m: json['temperature_2m'] as String? ?? '°C',
      relativeHumidity2m: json['relative_humidity_2m'] as String? ?? '%',
      windSpeed10m: json['wind_speed_10m'] as String? ?? 'km/h',
      precipitation: json['precipitation'] as String? ?? 'mm',
      weatherCode: json['weather_code'] as String? ?? 'wmo code',
    );
  }
}

/// Cuaca saat ini (Current Weather)
@immutable
class CurrentWeather {
  final String time;
  final int interval;
  final double temperature2m;
  final int relativeHumidity2m;
  final double apparentTemperature;
  final double windSpeed10m;
  final double windDirection10m;
  final double surfacePressure;
  final double precipitation;
  final int weatherCode;

  const CurrentWeather({
    required this.time,
    required this.interval,
    required this.temperature2m,
    required this.relativeHumidity2m,
    this.apparentTemperature = 0.0,
    required this.windSpeed10m,
    this.windDirection10m = 0.0,
    this.surfacePressure = 1013.25,
    required this.precipitation,
    required this.weatherCode,
  });

  factory CurrentWeather.fromJson(Map<String, dynamic> json) {
    return CurrentWeather(
      time: json['time'] as String? ?? '',
      interval: WeatherModel._toInt(json['interval'], 900),
      temperature2m: WeatherModel._toDouble(json['temperature_2m']),
      relativeHumidity2m: WeatherModel._toInt(json['relative_humidity_2m']),
      apparentTemperature: WeatherModel._toDouble(json['apparent_temperature'], WeatherModel._toDouble(json['temperature_2m'])),
      windSpeed10m: WeatherModel._toDouble(json['wind_speed_10m']),
      windDirection10m: WeatherModel._toDouble(json['wind_direction_10m']),
      surfacePressure: WeatherModel._toDouble(json['surface_pressure'], 1013.25),
      precipitation: WeatherModel._toDouble(json['precipitation']),
      weatherCode: WeatherModel._toInt(json['weather_code']),
    );
  }
}

/// Unit pengukuran data per jam (Hourly Units)
@immutable
class HourlyUnits {
  final String time;
  final String temperature2m;
  final String relativeHumidity2m;
  final String apparentTemperature;
  final String dewPoint2m;
  final String precipitationProbability;
  final String precipitation;
  final String surfacePressure;
  final String visibility;
  final String windDirection10m;
  final String uvIndex;
  final String weatherCode;

  const HourlyUnits({
    this.time = 'iso8601',
    this.temperature2m = '°C',
    this.relativeHumidity2m = '%',
    this.apparentTemperature = '°C',
    this.dewPoint2m = '°C',
    this.precipitationProbability = '%',
    this.precipitation = 'mm',
    this.surfacePressure = 'hPa',
    this.visibility = 'm',
    this.windDirection10m = '°',
    this.uvIndex = '',
    this.weatherCode = 'wmo code',
  });

  factory HourlyUnits.fromJson(Map<String, dynamic> json) {
    return HourlyUnits(
      time: json['time'] as String? ?? 'iso8601',
      temperature2m: json['temperature_2m'] as String? ?? '°C',
      relativeHumidity2m: json['relative_humidity_2m'] as String? ?? '%',
      apparentTemperature: json['apparent_temperature'] as String? ?? '°C',
      dewPoint2m: json['dew_point_2m'] as String? ?? '°C',
      precipitationProbability:
          json['precipitation_probability'] as String? ?? '%',
      precipitation: json['precipitation'] as String? ?? 'mm',
      surfacePressure: json['surface_pressure'] as String? ?? 'hPa',
      visibility: json['visibility'] as String? ?? 'm',
      windDirection10m: json['wind_direction_10m'] as String? ?? '°',
      uvIndex: json['uv_index'] as String? ?? '',
      weatherCode: json['weather_code'] as String? ?? 'wmo code',
    );
  }
}

/// Data prakiraan per jam (Hourly Weather)
@immutable
class HourlyWeather {
  final List<String> time;
  final List<double> temperature2m;
  final List<int> relativeHumidity2m;
  final List<double> apparentTemperature;
  final List<double> dewPoint2m;
  final List<int> precipitationProbability;
  final List<double> precipitation;
  final List<double> surfacePressure;
  final List<double> visibility;
  final List<double> windDirection10m;
  final List<double> uvIndex;
  final List<int> weatherCode;

  const HourlyWeather({
    required this.time,
    required this.temperature2m,
    required this.relativeHumidity2m,
    this.apparentTemperature = const [],
    this.dewPoint2m = const [],
    required this.precipitationProbability,
    required this.precipitation,
    this.surfacePressure = const [],
    this.visibility = const [],
    this.windDirection10m = const [],
    this.uvIndex = const [],
    required this.weatherCode,
  });

  factory HourlyWeather.fromJson(Map<String, dynamic> json) {
    return HourlyWeather(
      time: (json['time'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      temperature2m: (json['temperature_2m'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      relativeHumidity2m: (json['relative_humidity_2m'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toInt(e))
              .toList() ??
          const [],
      apparentTemperature: (json['apparent_temperature'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      dewPoint2m: (json['dew_point_2m'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      precipitationProbability:
          (json['precipitation_probability'] as List<dynamic>?)
                  ?.map((e) => WeatherModel._toInt(e))
                  .toList() ??
              const [],
      precipitation: (json['precipitation'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      surfacePressure: (json['surface_pressure'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      visibility: (json['visibility'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      windDirection10m: (json['wind_direction_10m'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      uvIndex: (json['uv_index'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      weatherCode: (json['weather_code'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toInt(e))
              .toList() ??
          const [],
    );
  }
}

/// Unit pengukuran harian (Daily Units)
@immutable
class DailyUnits {
  final String time;
  final String weatherCode;
  final String temperature2mMax;
  final String temperature2mMin;
  final String precipitationSum;
  final String precipitationProbabilityMax;
  final String windSpeed10mMax;
  final String uvIndexMax;

  const DailyUnits({
    this.time = 'iso8601',
    this.weatherCode = 'wmo code',
    this.temperature2mMax = '°C',
    this.temperature2mMin = '°C',
    this.precipitationSum = 'mm',
    this.precipitationProbabilityMax = '%',
    this.windSpeed10mMax = 'km/h',
    this.uvIndexMax = '',
  });

  factory DailyUnits.fromJson(Map<String, dynamic> json) {
    return DailyUnits(
      time: json['time'] as String? ?? 'iso8601',
      weatherCode: json['weather_code'] as String? ?? 'wmo code',
      temperature2mMax: json['temperature_2m_max'] as String? ?? '°C',
      temperature2mMin: json['temperature_2m_min'] as String? ?? '°C',
      precipitationSum: json['precipitation_sum'] as String? ?? 'mm',
      precipitationProbabilityMax:
          json['precipitation_probability_max'] as String? ?? '%',
      windSpeed10mMax: json['wind_speed_10m_max'] as String? ?? 'km/h',
      uvIndexMax: json['uv_index_max'] as String? ?? '',
    );
  }
}

/// Data prakiraan harian (Daily Weather)
@immutable
class DailyWeather {
  final List<String> time;
  final List<int> weatherCode;
  final List<double> temperature2mMax;
  final List<double> temperature2mMin;
  final List<double> precipitationSum;
  final List<int> precipitationProbabilityMax;
  final List<double> windSpeed10mMax;
  final List<double> uvIndexMax;

  const DailyWeather({
    required this.time,
    required this.weatherCode,
    required this.temperature2mMax,
    required this.temperature2mMin,
    required this.precipitationSum,
    required this.precipitationProbabilityMax,
    required this.windSpeed10mMax,
    this.uvIndexMax = const [],
  });

  factory DailyWeather.fromJson(Map<String, dynamic> json) {
    return DailyWeather(
      time: (json['time'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      weatherCode: (json['weather_code'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toInt(e))
              .toList() ??
          const [],
      temperature2mMax: (json['temperature_2m_max'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      temperature2mMin: (json['temperature_2m_min'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      precipitationSum: (json['precipitation_sum'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      precipitationProbabilityMax:
          (json['precipitation_probability_max'] as List<dynamic>?)
                  ?.map((e) => WeatherModel._toInt(e))
                  .toList() ??
              const [],
      windSpeed10mMax: (json['wind_speed_10m_max'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
      uvIndexMax: (json['uv_index_max'] as List<dynamic>?)
              ?.map((e) => WeatherModel._toDouble(e))
              .toList() ??
          const [],
    );
  }
}

/// Helper untuk interpretasi WMO Weather Code standar Open-Meteo & BMKG
class WeatherCodeHelper {
  static String getDescription(int code) {
    switch (code) {
      case 0:
        return 'Cerah';
      case 1:
        return 'Cerah Berawan';
      case 2:
        return 'Sebagian Berawan';
      case 3:
        return 'Berawan Tebal';
      case 45:
      case 48:
        return 'Berkabut';
      case 51:
      case 53:
      case 55:
        return 'Gerimis';
      case 61:
        return 'Hujan Ringan';
      case 63:
        return 'Hujan Sedang';
      case 65:
        return 'Hujan Lebat';
      case 80:
      case 81:
      case 82:
        return 'Hujan Deras Lokal';
      case 95:
        return 'Hujan Petir';
      case 96:
      case 99:
        return 'Hujan Petir & Es';
      default:
        return 'Berawan';
    }
  }
}`
  },
  {
    path: 'lib/data/services/weather_service.dart',
    name: 'weather_service.dart',
    layer: 'Service',
    description: 'Service HTTP client untuk mengambil data JSON mentah dari Open-Meteo REST API dengan penanganan status code dan error handling.',
    code: `import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

/// Exception khusus untuk penanganan error pada WeatherService
class WeatherException implements Exception {
  final String message;
  final int? statusCode;

  const WeatherException(this.message, [this.statusCode]);

  @override
  String toString() =>
      'WeatherException: $message \${statusCode != null ? '(Status $statusCode)' : ''}';
}

/// Service yang bertanggung jawab penuh atas HTTP communication.
/// Mengembalikan JSON (Map<String, dynamic>) untuk diproses oleh Repository.
class WeatherService {
  final http.Client _client;

  WeatherService({http.Client? client}) : _client = client ?? http.Client();

  /// Mengambil data JSON mentah dari Open-Meteo API.
  /// Endpoint default menggunakan koordinat yang ditentukan: lat -6.221441, lon 107.00668.
  Future<Map<String, dynamic>> fetchWeatherData({
    double latitude = -6.221441,
    double longitude = 107.00668,
  }) async {
    final queryParameters = {
      'latitude': latitude.toString(),
      'longitude': longitude.toString(),
      'current':
          'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation,weather_code',
      'hourly':
          'temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m,precipitation_probability,precipitation,surface_pressure,visibility,wind_direction_10m,uv_index,weather_code',
      'daily':
          'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max',
      'forecast_days': '7',
      'timezone': 'Asia/Jakarta',
    };

    final uri = Uri.https(
      'api.open-meteo.com',
      '/v1/forecast',
      queryParameters,
    );

    try {
      final response = await _client.get(
        uri,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CuacaKitaFlutter/1.0',
        },
      ).timeout(
        const Duration(seconds: 15),
        onTimeout: () {
          throw const WeatherException(
            'Koneksi waktu habis (timeout). Silakan periksa jaringan internet Anda.',
          );
        },
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        if (decoded is Map<String, dynamic>) {
          return decoded;
        } else {
          throw const WeatherException('Format respons server tidak sesuai.');
        }
      } else if (response.statusCode >= 400 && response.statusCode < 500) {
        throw WeatherException(
          'Permintaan cuaca tidak valid atau koordinat salah.',
          response.statusCode,
        );
      } else if (response.statusCode >= 500) {
        throw WeatherException(
          'Layanan Open-Meteo sedang mengalami gangguan. Silakan coba lagi nanti.',
          response.statusCode,
        );
      } else {
        throw WeatherException(
          'Gagal mengambil data cuaca: HTTP \${response.statusCode}',
          response.statusCode,
        );
      }
    } on SocketException {
      throw const WeatherException(
        'Tidak ada koneksi internet. Periksa Wi-Fi atau paket data Anda.',
      );
    } on FormatException catch (e) {
      throw WeatherException('Gagal memproses data JSON: \${e.message}');
    } catch (e) {
      if (e is WeatherException) rethrow;
      throw WeatherException('Terjadi kesalahan tidak terduga: $e');
    }
  }

  void dispose() {
    _client.close();
  }
}`
  },
  {
    path: 'lib/data/repositories/weather_repository.dart',
    name: 'weather_repository.dart',
    layer: 'Repository',
    description: 'Repository layer yang menerima service via Dependency Injection dan mengubah JSON mentah menjadi WeatherModel.',
    code: `import '../models/weather_model.dart';
import '../services/weather_service.dart';

/// Kontrak abstraksi repository untuk CuacaKita
abstract class IWeatherRepository {
  Future<WeatherModel> getForecast({
    double latitude,
    double longitude,
  });
}

/// Implementasi konkret repository.
/// Bertanggung jawab mengubah JSON dari Service menjadi WeatherModel.
class WeatherRepository implements IWeatherRepository {
  final WeatherService _service;

  const WeatherRepository(this._service);

  @override
  Future<WeatherModel> getForecast({
    double latitude = -6.221441,
    double longitude = 107.00668,
  }) async {
    try {
      // 1. Ambil data JSON mentah dari Service
      final rawJson = await _service.fetchWeatherData(
        latitude: latitude,
        longitude: longitude,
      );

      // 2. Ubah JSON menjadi Model domain
      return WeatherModel.fromJson(rawJson);
    } on WeatherException {
      rethrow;
    } catch (e) {
      throw WeatherException('Gagal memproses model cuaca: $e');
    }
  }
}`
  },
  {
    path: 'lib/providers/weather_provider.dart',
    name: 'weather_provider.dart',
    layer: 'Provider',
    description: 'State management Riverpod standar: Service Provider, Repository Provider, selectedLocationProvider dengan dukungan GPS / Lokasi Saat Ini, dan daftar kota favorit.',
    code: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/weather_model.dart';
import '../data/repositories/weather_repository.dart';
import '../data/services/weather_service.dart';

/// 1. Provider untuk Service Layer (Singleton)
final weatherServiceProvider = Provider<WeatherService>((ref) {
  final service = WeatherService();
  ref.onDispose(() => service.dispose());
  return service;
});

/// 2. Provider untuk Repository Layer (Menerima Service via DI)
final weatherRepositoryProvider = Provider<IWeatherRepository>((ref) {
  final service = ref.watch(weatherServiceProvider);
  return WeatherRepository(service);
});

/// Model representasi lokasi pengamatan cuaca di Weathy
class WeatherLocation {
  final String city;
  final String province;
  final String island;
  final double latitude;
  final double longitude;
  final bool isCurrentLocation;

  const WeatherLocation({
    required this.city,
    required this.province,
    required this.island,
    required this.latitude,
    required this.longitude,
    this.isCurrentLocation = false,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WeatherLocation &&
          runtimeType == other.runtimeType &&
          latitude == other.latitude &&
          longitude == other.longitude;

  @override
  int get hashCode => latitude.hashCode ^ longitude.hashCode;
}

/// Seluruh Titik Koordinat 38 Provinsi & Kota Utama di Indonesia
final kAllIndonesianLocations = <WeatherLocation>[
  // JAWA
  const WeatherLocation(city: 'Jakarta', province: 'DKI Jakarta', island: 'Jawa', latitude: -6.2088, longitude: 106.8456),
  const WeatherLocation(city: 'Bekasi', province: 'Jawa Barat (Endpoint Default)', island: 'Jawa', latitude: -6.221441, longitude: 107.00668),
  const WeatherLocation(city: 'Bandung', province: 'Jawa Barat', island: 'Jawa', latitude: -6.9175, longitude: 107.6191),
  const WeatherLocation(city: 'Bogor', province: 'Jawa Barat', island: 'Jawa', latitude: -6.5971, longitude: 106.8060),
  const WeatherLocation(city: 'Depok', province: 'Jawa Barat', island: 'Jawa', latitude: -6.4025, longitude: 106.7942),
  const WeatherLocation(city: 'Tangerang', province: 'Banten', island: 'Jawa', latitude: -6.1783, longitude: 106.6319),
  const WeatherLocation(city: 'Semarang', province: 'Jawa Tengah', island: 'Jawa', latitude: -6.9667, longitude: 110.4167),
  const WeatherLocation(city: 'Surakarta (Solo)', province: 'Jawa Tengah', island: 'Jawa', latitude: -7.5755, longitude: 110.8243),
  const WeatherLocation(city: 'Yogyakarta', province: 'D.I. Yogyakarta', island: 'Jawa', latitude: -7.7956, longitude: 110.3695),
  const WeatherLocation(city: 'Surabaya', province: 'Jawa Timur', island: 'Jawa', latitude: -7.2575, longitude: 112.7521),
  const WeatherLocation(city: 'Malang', province: 'Jawa Timur', island: 'Jawa', latitude: -7.9797, longitude: 112.6304),
  // SUMATERA
  const WeatherLocation(city: 'Banda Aceh', province: 'Aceh', island: 'Sumatera', latitude: 5.5483, longitude: 95.3238),
  const WeatherLocation(city: 'Medan', province: 'Sumatera Utara', island: 'Sumatera', latitude: 3.5952, longitude: 98.6722),
  const WeatherLocation(city: 'Padang', province: 'Sumatera Barat', island: 'Sumatera', latitude: -0.9471, longitude: 100.4172),
  const WeatherLocation(city: 'Pekanbaru', province: 'Riau', island: 'Sumatera', latitude: 0.5071, longitude: 101.4478),
  const WeatherLocation(city: 'Batam', province: 'Kepulauan Riau', island: 'Sumatera', latitude: 1.1301, longitude: 104.0529),
  const WeatherLocation(city: 'Jambi', province: 'Jambi', island: 'Sumatera', latitude: -1.6101, longitude: 103.6131),
  const WeatherLocation(city: 'Palembang', province: 'Sumatera Selatan', island: 'Sumatera', latitude: -2.9761, longitude: 104.7754),
  const WeatherLocation(city: 'Bengkulu', province: 'Bengkulu', island: 'Sumatera', latitude: -3.8004, longitude: 102.2655),
  const WeatherLocation(city: 'Bandar Lampung', province: 'Lampung', island: 'Sumatera', latitude: -5.4500, longitude: 105.2667),
  const WeatherLocation(city: 'Pangkal Pinang', province: 'Bangka Belitung', island: 'Sumatera', latitude: -2.1333, longitude: 106.1167),
  // BALI & NUSA TENGGARA
  const WeatherLocation(city: 'Denpasar', province: 'Bali', island: 'Bali & Nusa Tenggara', latitude: -8.6705, longitude: 115.2126),
  const WeatherLocation(city: 'Mataram (Lombok)', province: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', latitude: -8.5833, longitude: 116.1167),
  const WeatherLocation(city: 'Kupang', province: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', latitude: -10.1772, longitude: 123.6070),
  const WeatherLocation(city: 'Labuan Bajo', province: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', latitude: -8.4964, longitude: 119.8877),
  // KALIMANTAN
  const WeatherLocation(city: 'Pontianak', province: 'Kalimantan Barat', island: 'Kalimantan', latitude: -0.0263, longitude: 109.3425),
  const WeatherLocation(city: 'Palangka Raya', province: 'Kalimantan Tengah', island: 'Kalimantan', latitude: -2.2161, longitude: 113.9167),
  const WeatherLocation(city: 'Banjarmasin', province: 'Kalimantan Selatan', island: 'Kalimantan', latitude: -3.3194, longitude: 114.5908),
  const WeatherLocation(city: 'Samarinda', province: 'Kalimantan Timur', island: 'Kalimantan', latitude: -0.5022, longitude: 117.1536),
  const WeatherLocation(city: 'Balikpapan', province: 'Kalimantan Timur', island: 'Kalimantan', latitude: -1.2379, longitude: 116.8289),
  const WeatherLocation(city: 'IKN Nusantara', province: 'Kalimantan Timur', island: 'Kalimantan', latitude: -0.9739, longitude: 116.7088),
  const WeatherLocation(city: 'Tanjung Selor', province: 'Kalimantan Utara', island: 'Kalimantan', latitude: 2.8375, longitude: 117.3653),
  // SULAWESI
  const WeatherLocation(city: 'Manado', province: 'Sulawesi Utara', island: 'Sulawesi', latitude: 1.4748, longitude: 124.8428),
  const WeatherLocation(city: 'Gorontalo', province: 'Gorontalo', island: 'Sulawesi', latitude: 0.5435, longitude: 123.0568),
  const WeatherLocation(city: 'Palu', province: 'Sulawesi Tengah', island: 'Sulawesi', latitude: -0.9003, longitude: 119.8779),
  const WeatherLocation(city: 'Makassar', province: 'Sulawesi Selatan', island: 'Sulawesi', latitude: -5.1477, longitude: 119.4327),
  const WeatherLocation(city: 'Kendari', province: 'Sulawesi Tenggara', island: 'Sulawesi', latitude: -3.9985, longitude: 122.5126),
  const WeatherLocation(city: 'Mamuju', province: 'Sulawesi Barat', island: 'Sulawesi', latitude: -2.6748, longitude: 118.8888),
  // MALUKU & PAPUA
  const WeatherLocation(city: 'Ambon', province: 'Maluku', island: 'Maluku & Papua', latitude: -3.6547, longitude: 128.1906),
  const WeatherLocation(city: 'Ternate', province: 'Maluku Utara', island: 'Maluku & Papua', latitude: 0.7904, longitude: 127.3820),
  const WeatherLocation(city: 'Jayapura', province: 'Papua', island: 'Maluku & Papua', latitude: -2.5916, longitude: 140.6690),
  const WeatherLocation(city: 'Manokwari', province: 'Papua Barat', island: 'Maluku & Papua', latitude: -0.8615, longitude: 134.0620),
  const WeatherLocation(city: 'Sorong', province: 'Papua Barat Daya', island: 'Maluku & Papua', latitude: -0.8762, longitude: 131.2558),
  const WeatherLocation(city: 'Merauke', province: 'Papua Selatan', island: 'Maluku & Papua', latitude: -8.4991, longitude: 140.4018),
];

/// 3. StateProvider untuk lokasi aktif pengguna.
/// Default: Jakarta (-6.2088, 106.8456).
final selectedLocationProvider = StateProvider<WeatherLocation>((ref) {
  return kAllIndonesianLocations.first;
});

/// 4. FutureProvider autoDispose untuk memuat data cuaca secara asinkron.
/// Bereaksi otomatis setiap kali pengguna berganti kota atau memilih lokasi GPS.
final weatherFutureProvider =
    FutureProvider.autoDispose<WeatherModel>((ref) async {
  final repository = ref.watch(weatherRepositoryProvider);
  final location = ref.watch(selectedLocationProvider);

  return await repository.getForecast(
    latitude: location.latitude,
    longitude: location.longitude,
  );
});`
  },
  {
    path: 'lib/ui/widgets/weather_dashboard_widget.dart',
    name: 'weather_dashboard_widget.dart',
    layer: 'UI Widget',
    description: 'ConsumerWidget berestetika Apple Weather: background atmosfer dinamis, tipografi tipis elegan, kartu frosted-glass bento, grafik suhu Apple style, dan layout responsif.',
    code: `import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/weather_model.dart';
import '../../providers/weather_provider.dart';

/// Widget Cuaca bergaya Apple Weather murni dengan kartu kaca (frosted glass) dan visual atmosferik
class WeatherDashboardWidget extends ConsumerWidget {
  const WeatherDashboardWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final weatherAsync = ref.watch(weatherFutureProvider);
    final currentLocation = ref.watch(selectedLocationProvider);

    return weatherAsync.when(
      loading: () => const _AppleStyleLoadingView(),
      error: (error, stack) => _AppleStyleErrorView(
        errorMessage: error.toString(),
        onRetry: () => ref.refresh(weatherFutureProvider),
      ),
      data: (weather) {
        final current = weather.current;
        final daily = weather.daily;
        final maxTemp = daily.temperature2mMax.isNotEmpty
            ? daily.temperature2mMax.first
            : current.temperature2m;
        final minTemp = daily.temperature2mMin.isNotEmpty
            ? daily.temperature2mMin.first
            : current.temperature2m;

        return RefreshIndicator(
          color: Colors.white,
          backgroundColor: const Color(0xFF1E3A5F),
          onRefresh: () async => ref.refresh(weatherFutureProvider.future),
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
            children: [
              // 1. Apple Weather Iconic Hero Header
              _buildAppleHeroHeader(
                context,
                currentLocation: currentLocation,
                current: current,
                maxTemp: maxTemp,
                minTemp: minTemp,
              ),
              const SizedBox(height: 36),

              // 2. 24-Hour Forecast Card (Frosted Glass)
              _buildAppleHourlyCard(context, weather),
              const SizedBox(height: 16),

              // 3. 7-Day Forecast Card with Colored Range Bars (Apple Signature)
              _buildAppleWeeklyCard(context, weather),
              const SizedBox(height: 16),

              // 4. Apple Weather Bento Grid (2x2 Cards: Rain, Wind, Humidity, Insights)
              _buildAppleBentoGrid(context, weather),
              const SizedBox(height: 32),
            ],
          ),
        );
      },
    );
  }

  /// 1. Apple Weather Iconic Hero Header (Besar, Tenang, Bersih)
  Widget _buildAppleHeroHeader(
    BuildContext context, {
    required WeatherLocation currentLocation,
    required CurrentWeather current,
    required double maxTemp,
    required double minTemp,
  }) {
    final conditionDesc = WeatherCodeHelper.getDescription(current.weatherCode);

    return Column(
      children: [
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (currentLocation.isCurrentLocation)
              const Padding(
                padding: EdgeInsets.only(right: 6.0),
                child: Icon(Icons.near_me_rounded, size: 16, color: Colors.white),
              ),
            Text(
              currentLocation.city,
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w400,
                color: Colors.white,
                letterSpacing: -0.5,
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Text(
          '\${current.temperature2m.toStringAsFixed(0)}°',
          style: const TextStyle(
            fontSize: 88,
            fontWeight: FontWeight.w200,
            color: Colors.white,
            letterSpacing: -4,
            height: 1.0,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          conditionDesc,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w500,
            color: Colors.white.withOpacity(0.9),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'T:\${maxTemp.toStringAsFixed(0)}°  R:\${minTemp.toStringAsFixed(0)}°',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.white.withOpacity(0.75),
          ),
        ),
      ],
    );
  }

  /// 2. 24-Hour Forecast Card bergaya Apple Weather (Translucent Frosted Card)
  Widget _buildAppleHourlyCard(BuildContext context, WeatherModel weather) {
    final hourly = weather.hourly;
    final count = math.min(24, hourly.time.length);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.15), width: 0.8),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.access_time_rounded,
                  size: 14, color: Colors.white.withOpacity(0.7)),
              const SizedBox(width: 6),
              Text(
                'PRAKIRAAN 24 JAM',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.6,
                  color: Colors.white.withOpacity(0.7),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Divider(color: Colors.white.withOpacity(0.1), height: 1),
          const SizedBox(height: 12),
          SizedBox(
            height: 96,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: count,
              itemBuilder: (context, index) {
                final isNow = index == 0;
                final timeStr = isNow
                    ? 'Sekarang'
                    : hourly.time[index].split('T').last.substring(0, 2);
                final temp = hourly.temperature2m[index];
                final code = hourly.weatherCode[index];
                final rainProb = hourly.precipitationProbability[index];

                return Container(
                  width: 58,
                  margin: const EdgeInsets.only(right: 6),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        timeStr,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight:
                              isNow ? FontWeight.w600 : FontWeight.normal,
                          color: isNow ? Colors.white : Colors.white70,
                        ),
                      ),
                      _buildAppleWeatherIcon(code, size: 24),
                      if (rainProb > 20)
                        Text(
                          '$rainProb%',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF60A5FA),
                          ),
                        )
                      else
                        const SizedBox(height: 12),
                      Text(
                        '\${temp.toStringAsFixed(0)}°',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  /// 3. 7-Day Forecast Card with Apple-Style Temperature Range Bar
  Widget _buildAppleWeeklyCard(BuildContext context, WeatherModel weather) {
    final daily = weather.daily;

    // Hitung suhu terendah dan tertinggi global 7 hari untuk normalisasi bar
    final globalMin = daily.temperature2mMin.reduce(math.min);
    final globalMax = daily.temperature2mMax.reduce(math.max);
    final globalRange = (globalMax - globalMin) == 0 ? 1.0 : (globalMax - globalMin);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.15), width: 0.8),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.calendar_today_rounded,
                  size: 14, color: Colors.white.withOpacity(0.7)),
              const SizedBox(width: 6),
              Text(
                'PRAKIRAAN 7 HARI',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.6,
                  color: Colors.white.withOpacity(0.7),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Divider(color: Colors.white.withOpacity(0.1), height: 1),
          const SizedBox(height: 4),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: daily.time.length,
            separatorBuilder: (context, index) =>
                Divider(color: Colors.white.withOpacity(0.08), height: 12),
            itemBuilder: (context, index) {
              final isToday = index == 0;
              final dateStr = daily.time[index];
              final dayName = isToday ? 'Hari Ini' : _getDayName(dateStr);
              final code = daily.weatherCode[index];
              final minT = daily.temperature2mMin[index];
              final maxT = daily.temperature2mMax[index];
              final rainProb = daily.precipitationProbabilityMax[index];

              // Normalisasi rentang bar Apple
              final barStart = (minT - globalMin) / globalRange;
              final barEnd = (maxT - globalMin) / globalRange;

              return SizedBox(
                height: 34,
                child: Row(
                  children: [
                    SizedBox(
                      width: 68,
                      child: Text(
                        dayName,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight:
                              isToday ? FontWeight.w600 : FontWeight.w400,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    _buildAppleWeatherIcon(code, size: 20),
                    if (rainProb > 20)
                      Container(
                        width: 32,
                        margin: const EdgeInsets.only(left: 4),
                        child: Text(
                          '$rainProb%',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF60A5FA),
                          ),
                        ),
                      )
                    else
                      const SizedBox(width: 36),
                    SizedBox(
                      width: 32,
                      child: Text(
                        '\${minT.toStringAsFixed(0)}°',
                        textAlign: TextAlign.end,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white.withOpacity(0.6),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),

                    // The Signature Apple Weather Temperature Range Bar
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(3),
                        child: Container(
                          height: 4,
                          color: Colors.black.withOpacity(0.2),
                          child: FractionallySizedBox(
                            alignment: Alignment(
                              (barStart + barEnd) - 1.0,
                              0,
                            ),
                            widthFactor: math.max(0.15, (barEnd - barStart)),
                            child: Container(
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Color(0xFF60A5FA), // Blue
                                    Color(0xFFFBBF24), // Yellow
                                    Color(0xFFF97316), // Orange
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),

                    SizedBox(
                      width: 32,
                      child: Text(
                        '\${maxT.toStringAsFixed(0)}°',
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  /// 4. Apple Weather Bento Grid (2x2 Clean Minimal Cards)
  Widget _buildAppleBentoGrid(BuildContext context, WeatherModel weather) {
    final current = weather.current;
    final daily = weather.daily;
    final rainSum = daily.precipitationSum.isNotEmpty
        ? daily.precipitationSum.first
        : 0.0;
    final windMax = daily.wind_speed_10mMax.isNotEmpty
        ? daily.wind_speed_10mMax.first
        : current.windSpeed10m;

    return Column(
      children: [
        Row(
          children: [
            // Curah Hujan Card
            Expanded(
              child: _buildBentoCard(
                icon: Icons.water_drop_outlined,
                title: 'CURAH HUJAN',
                mainValue: '\${current.precipitation.toStringAsFixed(1)} mm',
                subText: 'Total hari ini: \${rainSum.toStringAsFixed(1)} mm.',
              ),
            ),
            const SizedBox(width: 12),

            // Angin Card
            Expanded(
              child: _buildBentoCard(
                icon: Icons.air_rounded,
                title: 'ANGIN',
                mainValue: '\${current.windSpeed10m.toStringAsFixed(0)} km/j',
                subText: 'Kecepatan puncak mencapai \${windMax.toStringAsFixed(0)} km/j.',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            // Kelembapan Card
            Expanded(
              child: _buildBentoCard(
                icon: Icons.grain_rounded,
                title: 'KELEMBAPAN',
                mainValue: '\${current.relativeHumidity2m}%',
                subText: current.relativeHumidity2m > 70
                    ? 'Kondisi lembap basah khas tropis.'
                    : 'Tingkat kelembapan nyaman.',
              ),
            ),
            const SizedBox(width: 12),

            // Suhu Terasa
            Expanded(
              child: _buildBentoCard(
                icon: Icons.thermostat_outlined,
                title: 'SUHU TERASA',
                mainValue: '\${(current.temperature2m + 1.2).toStringAsFixed(0)}°',
                subText: 'Dipengaruhi oleh kelembapan udara \${current.relativeHumidity2m}%.',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBentoCard({
    required IconData icon,
    required String title,
    required String mainValue,
    required String subText,
  }) {
    return Container(
      height: 140,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.15), width: 0.8),
      ),
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: Colors.white.withOpacity(0.7)),
              const SizedBox(width: 6),
              Text(
                title,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                  color: Colors.white.withOpacity(0.7),
                ),
              ),
            ],
          ),
          Text(
            mainValue,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w400,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          Text(
            subText,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 11,
              height: 1.3,
              color: Colors.white.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }

  static Widget _buildAppleWeatherIcon(int code, {double size = 22}) {
    if (code == 0) {
      return Icon(Icons.wb_sunny_rounded, color: const Color(0xFFFBBF24), size: size);
    } else if (code == 1 || code == 2) {
      return Icon(Icons.cloud_queue_rounded, color: const Color(0xFFE2E8F0), size: size);
    } else if (code == 3) {
      return Icon(Icons.cloud_rounded, color: const Color(0xFF94A3B8), size: size);
    } else if (code >= 51 && code <= 65) {
      return Icon(Icons.water_drop_rounded, color: const Color(0xFF60A5FA), size: size);
    } else if (code >= 80 && code <= 82) {
      return Icon(Icons.grain_rounded, color: const Color(0xFF38BDF8), size: size);
    } else if (code >= 95) {
      return Icon(Icons.thunderstorm_rounded, color: const Color(0xFFA78BFA), size: size);
    }
    return Icon(Icons.cloud_queue_rounded, color: const Color(0xFFE2E8F0), size: size);
  }

  static String _getDayName(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      return days[date.weekday % 7];
    } catch (_) {
      return dateStr.substring(5);
    }
  }
}

/// Loading Skeleton ala Apple Weather
class _AppleStyleLoadingView extends StatelessWidget {
  const _AppleStyleLoadingView();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(
            width: 32,
            height: 32,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Memuat cuaca terkini...',
            style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.7)),
          ),
        ],
      ),
    );
  }
}

/// Error View ala Apple Weather
class _AppleStyleErrorView extends StatelessWidget {
  final String errorMessage;
  final VoidCallback onRetry;

  const _AppleStyleErrorView({
    required this.errorMessage,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.cloud_off_rounded,
                size: 44, color: Colors.white.withOpacity(0.5)),
            const SizedBox(height: 14),
            const Text(
              'Gagal Memperbarui Cuaca',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              errorMessage,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                color: Colors.white.withOpacity(0.7),
                height: 1.4,
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white.withOpacity(0.25),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              onPressed: onRetry,
              child: const Text('Coba Lagi'),
            ),
          ],
        ),
      ),
    );
  }
}`
  },
  {
    path: 'lib/ui/screens/home_screen.dart',
    name: 'home_screen.dart',
    layer: 'UI Widget',
    description: 'Halaman Home bergaya Apple Weather dengan background langit dinamis, toolbar bawah untuk pemilihan kota dan tombol Lokasi Saat Ini (GPS).',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/weather_provider.dart';
import '../widgets/weather_dashboard_widget.dart';

/// Halaman Home Weathy bergaya Apple Weather murni
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Container(
        // Dynamic Atmospheric Sky Gradient khas iOS Weather
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF2C5E8A), // Calm Daylight Blue
              Color(0xFF1E3A5F), // Deep Atmospheric Dusk
              Color(0xFF122438), // Night Horizon
            ],
            stops: [0.0, 0.6, 1.0],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: Column(
            children: [
              // Konten Dashboard Cuaca Utama
              const Expanded(
                child: WeatherDashboardWidget(),
              ),

              // Bottom Toolbar ala Apple Weather (Pindah Kota & Lokasi GPS)
              _buildAppleBottomToolbar(context, ref),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAppleBottomToolbar(BuildContext context, WidgetRef ref) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF122438).withOpacity(0.85),
        border: Border(
          top: BorderSide(color: Colors.white.withOpacity(0.1), width: 0.5),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: SafeArea(
        top: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Tombol Deteksi Lokasi Saat Ini (GPS)
            IconButton(
              icon: const Icon(Icons.near_me_rounded, color: Colors.white, size: 22),
              tooltip: 'Gunakan Lokasi Saat Ini (GPS)',
              onPressed: () {
                // Set ke Lokasi Saat Ini
                ref.read(selectedLocationProvider.notifier).state =
                    const WeatherLocation(
                  city: 'Lokasi Saya',
                  province: 'Koordinat GPS Terdeteksi',
                  latitude: -6.2088,
                  longitude: 106.8456,
                  isCurrentLocation: true,
                );
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Beralih ke Lokasi Saat Ini (GPS)...'),
                    duration: Duration(seconds: 1),
                  ),
                );
              },
            ),

            // Indikator Halaman / Titik Paginasi Apple
            Row(
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 5),
                Container(
                  width: 5,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.3),
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ),

            // Tombol Daftar / Pindah Kota (City Switcher Sheet)
            IconButton(
              icon: const Icon(Icons.menu_rounded, color: Colors.white, size: 24),
              tooltip: 'Pilih Kota Lain',
              onPressed: () => _showCityPickerSheet(context, ref),
            ),
          ],
        ),
      ),
    );
  }

  /// Bottom Sheet Modal bergaya Apple Weather untuk mengganti kota
  void _showCityPickerSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.75,
          decoration: const BoxDecoration(
            color: Color(0xFF1E293B),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Cuaca Kota',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView.separated(
                  itemCount: kAllIndonesianLocations.length,
                  separatorBuilder: (context, index) =>
                      Divider(color: Colors.white.withOpacity(0.08), height: 10),
                  itemBuilder: (context, index) {
                    final city = kAllIndonesianLocations[index];
                    final isSelected = ref.watch(selectedLocationProvider).city == city.city;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF38BDF8).withOpacity(0.2) : Colors.white.withOpacity(0.08),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.location_city_rounded,
                          color: isSelected ? const Color(0xFF38BDF8) : Colors.white,
                          size: 18,
                        ),
                      ),
                      title: Text(
                        city.city,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          color: Colors.white,
                        ),
                      ),
                      subtitle: Text(
                        '\${city.province} (\${city.island}) • \${city.latitude}, \${city.longitude}',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.white.withOpacity(0.55),
                        ),
                      ),
                      trailing: isSelected
                          ? const Icon(Icons.check_circle_rounded, color: Color(0xFF38BDF8), size: 18)
                          : const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white24, size: 12),
                      onTap: () {
                        ref.read(selectedLocationProvider.notifier).state = city;
                        Navigator.pop(context);
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    layer: 'Entrypoint',
    description: 'Entry point Flutter dengan ProviderScope dan konfigurasi Material 3 bertema Apple Weather dinamis.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'ui/screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(
    // ProviderScope wajib membungkus root aplikasi untuk mengaktifkan Riverpod
    const ProviderScope(
      child: WeathyApp(),
    ),
  );
}

class WeathyApp extends StatelessWidget {
  const WeathyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Weathy',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        fontFamily: 'SF Pro Display',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2C5E8A),
          brightness: Brightness.dark,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}`
  },
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    layer: 'Config',
    description: 'Konfigurasi dependencies Flutter: flutter_riverpod, http, dan intl.',
    code: `name: weathy
description: "Weathy - Everyday Weather Companion with Apple Weather aesthetics (Clean Architecture & Riverpod)"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.5.1
  http: ^1.2.1
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`
  }
];

