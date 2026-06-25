import React from 'react';

export default function ConfidenceBar({ confidence, score }) {
  const percentage = score ? Math.round(score * 100) : 0;
  
  const colors = {
    high: 'bg-green-500',
    medium: 'bg-amber-500',
    low: 'bg-red-500'
  };
  
  const color = colors[confidence] || colors.low;
  const textColors = {
    high: 'text-green-700',
    medium: 'text-amber-700',
    low: 'text-red-700'
  };

  return (
    <div className="w-full mt-1">
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        <span className="text-gray-600">Confidence</span>
        <span className={`${textColors[confidence] || 'text-gray-600'} capitalize`}>
          {confidence} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
