import React, { useState } from 'react';
import { Copy, Check, FileCode, FolderTree, Info, Sparkles, Layers, Terminal } from 'lucide-react';
import { FLUTTER_CODE_FILES, FlutterFile } from '../data/flutterCode';

interface CodeViewerProps {
  selectedFile?: string;
  onSelectFile?: (name: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ selectedFile, onSelectFile }) => {
  const [currentFileName, setCurrentFileName] = useState<string>(
    selectedFile || 'weather_model.dart'
  );
  const [copied, setCopied] = useState(false);

  const activeFile: FlutterFile =
    FLUTTER_CODE_FILES.find((f) => f.name === (selectedFile || currentFileName)) ||
    FLUTTER_CODE_FILES[0];

  const handleSelect = (name: string) => {
    setCurrentFileName(name);
    if (onSelectFile) onSelectFile(name);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const layerColors: Record<string, string> = {
    'Model': 'bg-amber-100 text-amber-800 border-amber-300',
    'Service': 'bg-blue-100 text-blue-800 border-blue-300',
    'Repository': 'bg-purple-100 text-purple-800 border-purple-300',
    'Provider': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'UI Widget': 'bg-rose-100 text-rose-800 border-rose-300',
    'Entrypoint': 'bg-slate-100 text-slate-800 border-slate-300',
    'Config': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[820px]">
      {/* Top Bar with File Tabs & Layer Badge */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <FolderTree className="w-4 h-4 text-emerald-400 shrink-0" />
          {FLUTTER_CODE_FILES.map((file) => {
            const isActive = file.name === activeFile.name;
            return (
              <button
                key={file.name}
                onClick={() => handleSelect(file.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-emerald-300 font-semibold border border-emerald-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 opacity-70" />
                {file.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E7D32] hover:bg-emerald-600 active:scale-95 text-white rounded-lg text-xs font-semibold shadow transition-all"
            title="Salin Kode File Ini"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Salin File
              </>
            )}
          </button>
        </div>
      </div>

      {/* File Path & Architecture Summary Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <span className="text-slate-500">Path:</span>
          <span className="text-emerald-400 font-semibold">{activeFile.path}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
              layerColors[activeFile.layer] || 'bg-slate-800 text-slate-200'
            }`}
          >
            Layer: {activeFile.layer}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {activeFile.code.split('\n').length} baris kode
          </span>
        </div>
      </div>

      {/* File Brief Description */}
      <div className="bg-slate-850/60 px-4 py-2 border-b border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="truncate">{activeFile.description}</span>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-auto bg-[#0F172A] p-4 text-xs font-mono text-slate-200 leading-relaxed select-text">
        <pre className="overflow-x-auto">
          <code>
            {activeFile.code.split('\n').map((line, idx) => (
              <div key={idx} className="table-row hover:bg-slate-800/40">
                <span className="table-cell pr-4 text-right select-none text-slate-600 text-[11px] w-10">
                  {idx + 1}
                </span>
                <span className="table-cell whitespace-pre">
                  {colorizeDartLine(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Bottom Command Hint */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Install dependencies:</span>
          <code className="text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            flutter pub add flutter_riverpod http intl
          </code>
        </div>
        <span className="text-slate-500 hidden sm:inline">
          Flutter 3 • Riverpod Standar (No code-gen)
        </span>
      </div>
    </div>
  );
};

// Simple Dart syntax colorizer for visual delight
function colorizeDartLine(line: string): React.ReactNode {
  if (line.trim().startsWith('//') || line.trim().startsWith('///')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }
  if (line.trim().startsWith('import ') || line.trim().startsWith('export ')) {
    return <span className="text-purple-400">{line}</span>;
  }
  if (line.includes('@immutable') || line.includes('@override')) {
    return <span className="text-amber-400">{line}</span>;
  }
  if (line.includes('class ') || line.includes('abstract class ')) {
    return <span className="text-cyan-300 font-semibold">{line}</span>;
  }
  if (line.includes('final ') || line.includes('const ') || line.includes('return ')) {
    return <span className="text-blue-300">{line}</span>;
  }
  return line;
}
