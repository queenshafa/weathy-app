import React, { useState } from 'react';
import { 
  Sprout, 
  Smartphone, 
  Monitor,
  Code2, 
  BookOpen, 
  Layers, 
  Terminal, 
  Check, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Braces, 
  Cpu, 
  Download,
  CloudSun
} from 'lucide-react';
import { FlutterSimulator } from './components/FlutterSimulator';
import { DesktopWeatherView } from './components/DesktopWeatherView';
import { CodeViewer } from './components/CodeViewer';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { JsonInspector } from './components/JsonInspector';
import { FLUTTER_CODE_FILES } from './data/flutterCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'desktop' | 'code' | 'guide' | 'json'>('simulator');
  const [selectedFileInViewer, setSelectedFileInViewer] = useState<string>('weather_model.dart');
  const [allCopied, setAllCopied] = useState(false);

  const handleSelectCodeFile = (fileName: string) => {
    setSelectedFileInViewer(fileName);
    setActiveTab('code');
  };

  const handleCopyAllCode = () => {
    const combined = FLUTTER_CODE_FILES.map(
      (f) => `// ==========================================\n// FILE: ${f.path}\n// LAYER: ${f.layer}\n// ==========================================\n\n${f.code}\n\n`
    ).join('\n');
    navigator.clipboard.writeText(combined);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <CloudSun className="w-4 h-4 text-blue-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                    Weathy
                  </h1>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-md">
                    Apple Weather Style
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Smart Weather Companion • Clean Architecture &amp; Riverpod
                </p>
              </div>
            </div>

            {/* Main Navigation Tabs */}
            <nav className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'simulator'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile (iOS)</span>
                <span className="sm:hidden">Mobile</span>
              </button>

              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'desktop'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop (macOS)</span>
                <span className="sm:hidden">Desktop</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'code'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>5 Layer Code</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'guide'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Penjelasan 9 Poin</span>
                <span className="sm:hidden">Panduan</span>
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'json'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Braces className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">JSON Open-Meteo</span>
                <span className="sm:hidden">JSON</span>
              </button>
            </nav>

            {/* Quick Action: Copy Entire Project */}
            <div className="hidden lg:block">
              <button
                onClick={handleCopyAllCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-all active:scale-95"
              >
                {allCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Salin 5 File Flutter
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Tab 1: Flutter Mobile Interactive Simulator (Original Untouched) */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-2.5 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">Tampilan Mobile (iOS Style)</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">Mockup smartphone dengan sudut cahaya di pojok atas, animasi hujan/angin/daun, dan 38 provinsi</span>
              </div>
              <button
                onClick={() => setActiveTab('desktop')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-1"
              >
                <Monitor className="w-3.5 h-3.5" />
                Buka Tampilan Desktop
              </button>
            </div>
            <FlutterSimulator onSelectCodeTab={handleSelectCodeFile} />
          </div>
        )}

        {/* Tab 2: Widescreen Apple Weather Desktop (macOS Style) */}
        {activeTab === 'desktop' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-2.5 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Monitor className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">Tampilan Desktop Widescreen (macOS Style)</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">Dashboard cuaca layar penuh dengan panel bento lengkap, sidebar navigasi 38 provinsi, dan efek partikel</span>
              </div>
              <button
                onClick={() => setActiveTab('simulator')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Beralih ke Tampilan Mobile
              </button>
            </div>
            <DesktopWeatherView onSelectCodeTab={handleSelectCodeFile} />
          </div>
        )}

        {/* Tab 2: 5 Layer Flutter Code Viewer */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-[#2E7D32] rounded-xl">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Implementasi 5 Layer Lengkap (Clean Architecture)
                  </h3>
                  <p className="text-slate-500">
                    Model, Service, Repository, Provider, UI Widget, dan Screen siap pakai tanpa code generation.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                  flutter pub add flutter_riverpod http intl
                </span>
                <button
                  onClick={handleCopyAllCode}
                  className="px-3 py-1.5 bg-[#1D4ED8] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
                >
                  {allCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {allCopied ? 'Tersalin' : 'Salin Semua'}
                </button>
              </div>
            </div>

            <CodeViewer
              selectedFile={selectedFileInViewer}
              onSelectFile={(name) => setSelectedFileInViewer(name)}
            />
          </div>
        )}

        {/* Tab 3: Complete 9-Point Architecture Guide */}
        {activeTab === 'guide' && (
          <div>
            <ArchitectureGuide />
          </div>
        )}

        {/* Tab 4: Open-Meteo JSON Inspector */}
        {activeTab === 'json' && (
          <div>
            <JsonInspector />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">Weathy</span>
            <span>— Everyday Weather Companion (Apple Weather Style)</span>
          </div>
          <div>
            Clean Architecture • Flutter 3 • Flutter Riverpod • Open-Meteo API
          </div>
        </div>
      </footer>
    </div>
  );
}
