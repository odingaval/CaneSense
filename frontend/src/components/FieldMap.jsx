import React from 'react';
import { MapPin } from 'lucide-react';

export default function FieldMap({ lat, lng }) {
  return (
    <div className="w-full h-48 bg-canesense-light rounded-xl overflow-hidden relative flex items-center justify-center border border-gray-200">
      {/* Mock Map Background */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <div className="z-10 flex flex-col items-center bg-white/80 p-3 rounded-lg shadow-sm backdrop-blur-sm">
        <MapPin className="text-canesense-green w-8 h-8 mb-1" />
        <span className="text-xs font-medium text-gray-600">
          {lat?.toFixed(4)}, {lng?.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
