import React from 'react';
import { 
  Layers, 
  Workflow, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Code2, 
  Terminal, 
  Cpu, 
  HelpCircle,
  FileCode,
  PackageCheck,
  CloudSun
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#1D4ED8] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 mb-4 border border-white/10">
            <CloudSun className="w-3.5 h-3.5" />
            Clean Architecture &amp; Riverpod Guide — Weathy
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Panduan Arsitektur &amp; Integrasi Weathy
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            Implementasi 5 layer Clean Architecture profesional bergaya Apple Weather (Clean, Frosted Glass, Dynamic Atmospheric Gradient), integrasi Open-Meteo REST API, deteksi Lokasi Saat Ini (GPS), dan pemilihan kota.
          </p>
        </div>
      </div>

      {/* Visual Clean Architecture Flow Diagram */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-blue-600" />
            Alur Data Clean Architecture (End-to-End)
          </h3>
          <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
            Unidirectional Data Flow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Step 1: Remote API */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                External Source
              </div>
              <div className="font-bold text-sm text-slate-900 mb-1">
                Open-Meteo API
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menyediakan data cuaca, suhu, kelembapan, angin, dan <code>weather_code</code> via REST JSON.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-200 text-[11px] font-mono text-blue-700">
              api.open-meteo.com
            </div>
          </div>

          {/* Step 2: Service */}
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-blue-600 uppercase tracking-wider mb-1">
                Layer 2
              </div>
              <div className="font-bold text-sm text-blue-950 mb-1">
                WeatherService
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Melakukan HTTP GET via <code>package:http</code>, validasi status code, timeout, dan <code>jsonDecode</code>.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-blue-200 text-[11px] font-mono text-blue-800">
              http.get() &amp; jsonDecode
            </div>
          </div>

          {/* Step 3: Repository & Model */}
          <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-indigo-600 uppercase tracking-wider mb-1">
                Layer 1 &amp; 3
              </div>
              <div className="font-bold text-sm text-indigo-950 mb-1">
                Repository &amp; Model
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Repository mengubah JSON dari Service menjadi <code>WeatherModel</code> domain yang immutable &amp; null-safe.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-indigo-200 text-[11px] font-mono text-indigo-800">
              WeatherModel.fromJson()
            </div>
          </div>

          {/* Step 4: Riverpod Provider */}
          <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-sky-600 uppercase tracking-wider mb-1">
                Layer 4
              </div>
              <div className="font-bold text-sm text-sky-950 mb-1">
                Riverpod Provider
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <code>weatherFutureProvider</code> memegang state <code>AsyncValue&lt;WeatherModel&gt;</code> secara reaktif.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-sky-200 text-[11px] font-mono text-sky-800">
              AsyncValue State
            </div>
          </div>

          {/* Step 5: UI ConsumerWidget */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mb-1">
                Layer 5
              </div>
              <div className="font-bold text-sm text-white mb-1">
                WeatherDashboard
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ConsumerWidget dengan <code>.when()</code>: render Skeleton, Error view, atau Dashboard BMKG Style.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-700 text-[11px] font-mono text-blue-300">
              Material 3 Navy / Blue
            </div>
          </div>
        </div>
      </div>

      {/* 9 Required Sections Detailed Guide */}
      <div className="space-y-6">
        
        {/* Section 1: Penjelasan Arsitektur & Alur Data */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
              1
            </span>
            <h3 className="font-bold text-lg text-slate-900">
              Penjelasan Arsitektur dan Alur Data
            </h3>
          </div>
          
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              Aplikasi <strong>CuacaKita</strong> menerapkan <strong>Clean Architecture</strong> untuk memisahkan antara antarmuka (Presentation), logika bisnis (Domain/State), dan sumber data jaringan (Data Source).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Dependency Inversion Principle (DIP):</span>
                UI tidak pernah memanggil HTTP client secara langsung. UI hanya mengamati <code>weatherFutureProvider</code>. Provider meminta data ke <code>IWeatherRepository</code>, dan Repository memanggil <code>WeatherService</code> via Constructor Injection.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Unidirectional Flow:</span>
                Data mengalir satu arah: Server Open-Meteo → HTTP Response → JSON Map → WeatherModel Domain → Riverpod AsyncValue → UI Widget ConsumerWidget.
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Package yang Perlu Di-install */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
              2
            </span>
            <h3 className="font-bold text-lg text-slate-900">
              Package yang Perlu Di-install
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Hanya package resmi dan penting yang digunakan tanpa library code-gen yang berat:
          </p>
          <div className="p-4 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl overflow-x-auto flex items-center justify-between">
            <code>flutter pub add flutter_riverpod http intl</code>
          </div>
        </div>

        {/* Section 3-7: Fungsi Setiap File */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
              3
            </span>
            <h3 className="font-bold text-lg text-slate-900">
              Fungsi Kelima File Clean Architecture
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-sm block">1. weather_model.dart (Model Layer)</span>
              <p className="text-slate-600 mt-1">
                Mendefinisikan objek cuaca yang <strong>immutable</strong> (CurrentWeather, HourlyWeather, DailyWeather) dengan factory <code>fromJson</code>. Mengamankan konversi tipe data (misal angka 0.0 atau 0) menggunakan helper statis <code>_toDouble</code> dan <code>_toInt</code>. Menyertakan <code>WeatherCodeHelper</code> untuk menerjemahkan WMO Weather Code Open-Meteo ke label BMKG Indonesia (Cerah, Cerah Berawan, Hujan Sedang, Hujan Petir).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-sm block">2. weather_service.dart (Service Layer)</span>
              <p className="text-slate-600 mt-1">
                Bertanggung jawab penuh atas komunikasi jaringan HTTP GET ke Open-Meteo. Memeriksa status kode HTTP (200, 4xx, 5xx), menetapkan batas timeout (15 detik), melakukan <code>jsonDecode()</code>, dan mengembalikan raw JSON (<code>Map&lt;String, dynamic&gt;</code>) kepada Repository.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-sm block">3. weather_repository.dart (Repository Layer)</span>
              <p className="text-slate-600 mt-1">
                Pintu masuk data (Single Source of Truth) bagi aplikasi. Menerima <code>WeatherService</code> via constructor injection. Bertanggung jawab mengubah data mentah JSON menjadi objek <code>WeatherModel</code>, sehingga lapisan presenter tidak perlu tahu sumber asal data.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-sm block">4. weather_provider.dart (Provider Layer)</span>
              <p className="text-slate-600 mt-1">
                Mengelola state management menggunakan <strong>Riverpod standar</strong> tanpa build_runner. Menyediakan <code>weatherServiceProvider</code>, <code>weatherRepositoryProvider</code>, <code>selectedLocationProvider</code> untuk pergantian kota, dan <code>weatherFutureProvider</code> bertipe <code>FutureProvider.autoDispose</code>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-sm block">5. weather_dashboard_widget.dart (UI Widget Layer)</span>
              <p className="text-slate-600 mt-1">
                <code>ConsumerWidget</code> berbasis Material Design 3 dengan palet warna Navy, Biru, dan Putih. Menangani 3 state asinkron menggunakan <code>.when(loading, error, data)</code>. Menampilkan Suhu Utama berukuran besar, Grafik tren suhu per jam via <code>CustomPainter</code>, Prakiraan 7 Hari, Rain Monitoring, Temp &amp; Humidity, Wind Monitoring, dan Weather Insights.
              </p>
            </div>
          </div>
        </div>

        {/* Section 8: Cara Memasang Widget ke Halaman Utama */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
              4
            </span>
            <h3 className="font-bold text-lg text-slate-900">
              Cara Memasang Widget pada Halaman Utama
            </h3>
          </div>
          <div className="p-4 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
            <pre>
{`// 1. Bungkus Root Aplikasi di main.dart dengan ProviderScope
void main() {
  runApp(
    const ProviderScope( // Wajib untuk Riverpod
      child: CuacaKitaApp(),
    ),
  );
}

// 2. Pasang WeatherDashboardWidget di HomeScreen
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('CuacaKita')),
      body: const SafeArea(
        child: WeatherDashboardWidget(), // Widget siap pakai
      ),
    );
  }
}`}
            </pre>
          </div>
        </div>

        {/* Section 9: Cara Menjalankan & Menguji Aplikasi */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
              5
            </span>
            <h3 className="font-bold text-lg text-slate-900">
              Cara Menjalankan dan Menguji Aplikasi
            </h3>
          </div>
          <div className="space-y-3 text-xs text-slate-700">
            <div>
              <span className="font-bold text-slate-900 block mb-1">1. Menjalankan di Emulator / Perangkat Nyata:</span>
              <div className="p-3 bg-slate-900 text-blue-300 font-mono rounded-xl">
                <code>flutter run</code>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">2. Menjalankan Unit Test (Mocking Service &amp; Repository):</span>
              <div className="p-3 bg-slate-900 text-blue-300 font-mono rounded-xl">
                <code>flutter test</code>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
