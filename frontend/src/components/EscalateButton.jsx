import React from 'react';
import { PhoneCall } from 'lucide-react';
import en from '../locales/en.json';

const t = (key) => en[key] || key;

export default function EscalateButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold shadow-md shadow-red-200 transition-all active:scale-95"
    >
      <PhoneCall className="w-5 h-5" />
      {t('action.escalate')}
    </button>
  );
}
