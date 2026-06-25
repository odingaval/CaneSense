import React from 'react';
import en from '../locales/en.json';

const t = (key) => en[key] || key;

const PRESETS = [
  "yellowing", "wilting", "stunted", "holes", "powder", "patches", "other"
];

export default function SymptomPicklist({ value, onChange }) {
  // Check if current value matches any preset (case insensitive)
  const isPreset = PRESETS.some(p => t(`symptom.${p}`).toLowerCase() === value.toLowerCase());
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const label = t(`symptom.${p}`);
          const isSelected = value.toLowerCase() === label.toLowerCase() || (p === 'other' && value && !isPreset);
          
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p === 'other' ? '' : label)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                isSelected 
                  ? 'bg-canesense-green text-white border-canesense-green shadow-sm' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      
      {(!isPreset && value !== '' || value === '') && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the problem..."
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-canesense-green focus:border-transparent outline-none transition-shadow"
        />
      )}
    </div>
  );
}
