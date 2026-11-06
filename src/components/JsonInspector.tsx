import React, { useState } from 'react';
import { Code, Check, Copy, ExternalLink } from 'lucide-react';
import { SAMPLE_CUACAKITA_DATA } from '../data/sampleData';

export const JsonInspector: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const jsonStr = JSON.stringify(SAMPLE_CUACAKITA_DATA, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endpointUrl = 'https://api.open-meteo.com/v1/forecast?latitude=-6.221441&longitude=107.00668&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation,weather_code&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m,precipitation_probability,precipitation,surface_pressure,visibility,wind_direction_10m,uv_index,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&forecast_days=7&timezone=Asia%2FJakarta';

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Open-Meteo Weather API Raw JSON (Weathy)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Endpoint dengan <code>weather_code</code> untuk current, hourly, dan daily.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={endpointUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
          >
            <span>Live Endpoint</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1D4ED8] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Salin JSON
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-[#0b1120] p-4 rounded-xl border border-slate-800 max-h-[500px] overflow-auto text-xs font-mono text-blue-300 leading-relaxed">
        <pre>{jsonStr}</pre>
      </div>
    </div>
  );
};
