import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Activity, Map, CloudRain, ThermometerSun, ArrowLeft, MessageSquare } from 'lucide-react';
import ConfidenceBar from '../components/ConfidenceBar';
import EscalateButton from '../components/EscalateButton';

export default function ResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  
  if (!result) {
    return (
      <div className="text-center p-8">
        <p>No result found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-canesense-green underline">Go back</button>
      </div>
    );
  }

  const { 
    top_cause, 
    confidence, 
    confidence_score, 
    reasoning, 
    recommendation, 
    cost_saving, 
    escalate,
    escalation_reason,
    data_used,
    sms_summary
  } = result;

  const displayCause = top_cause.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-8">
      {escalate && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 shrink-0 text-red-500" />
          <div>
            <h3 className="font-bold">Expert Review Needed</h3>
            <p className="text-sm mt-1">{escalation_reason}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Likely Cause</h2>
        <div className={`text-3xl font-black mb-4 ${escalate ? 'text-gray-800' : 'text-canesense-green'}`}>
          {displayCause}
        </div>
        <ConfidenceBar confidence={confidence} score={confidence_score} />
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-500" />
          Why we think this
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{reasoning}</p>
      </div>

      {escalate ? (
        <EscalateButton onClick={() => alert('Dialing agronomist...')} />
      ) : (
        <div className="bg-canesense-light border border-green-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-canesense-green opacity-5 rounded-bl-full"></div>
          <h3 className="font-bold text-canesense-green mb-2">Recommended Action</h3>
          <p className="text-gray-800 font-medium mb-3">{recommendation}</p>
          <div className="bg-white/60 p-3 rounded-xl border border-green-100 backdrop-blur-sm flex items-center gap-2 text-green-800 text-sm font-semibold">
            <span className="text-xl">💰</span>
            {cost_saving}
          </div>
        </div>
      )}

      {data_used && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Data Used</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Map className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <div className="text-xs text-gray-500">Satellite</div>
              <div className="text-xs font-semibold mt-0.5 truncate" title={data_used.ndvi_trend}>
                {data_used.ndvi_trend}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <CloudRain className="w-5 h-5 mx-auto mb-1 text-cyan-500" />
              <div className="text-xs text-gray-500">Rain gap</div>
              <div className="text-xs font-semibold mt-0.5">{data_used.rainfall_gap_days}d</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <ThermometerSun className="w-5 h-5 mx-auto mb-1 text-amber-600" />
              <div className="text-xs text-gray-500">Nitrogen</div>
              <div className="text-xs font-semibold mt-0.5 capitalize">{data_used.soil_nitrogen}</div>
            </div>
          </div>
        </div>
      )}

      {sms_summary && (
        <div className="mt-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">SMS Fallback View</h3>
          <div className="bg-gray-200 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-800 max-w-[85%] relative shadow-sm">
            <MessageSquare className="absolute -left-2 top-0 w-4 h-4 text-gray-200 fill-current" />
            {sms_summary}
          </div>
        </div>
      )}

      <button 
        onClick={() => navigate('/')}
        className="w-full flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 p-4 rounded-xl font-semibold transition-colors mt-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Check another field
      </button>
    </div>
  );
}
