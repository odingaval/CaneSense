import React from 'react';
import en from '../locales/en.json';

// Simple i18n mock using EN only for now
const t = (key) => en[key] || key;

export default function StatusBadge({ status }) {
  const statusColors = {
    healthy: 'bg-green-100 text-green-800 border-green-200',
    caution: 'bg-amber-100 text-amber-800 border-amber-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  };

  const colorClass = statusColors[status] || statusColors.healthy;
  const label = t(`field.status.${status}`);

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colorClass} inline-flex items-center`}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${status === 'healthy' ? 'bg-green-500' : status === 'caution' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
      {label}
    </span>
  );
}
