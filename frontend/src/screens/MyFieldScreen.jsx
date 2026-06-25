import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import FieldMap from '../components/FieldMap';

export default function MyFieldScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo, load the mock field "fld_demo"
    apiClient.getField('fld_demo')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading field data...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load field</div>;
  }

  const { field, last_diagnosis } = data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <StatusBadge status={field.status} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{field.name}</h2>
        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <Clock className="w-4 h-4" /> Last checked: {field.last_checked || 'Never'}
        </p>
        
        <FieldMap lat={field.lat} lng={field.lng} />
      </div>

      {last_diagnosis && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Previous Diagnosis</h3>
          <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
            {field.status === 'healthy' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${field.status === 'urgent' ? 'text-red-500' : 'text-amber-500'}`} />
            )}
            <div>
              <p className="text-gray-800 font-medium capitalize">{last_diagnosis.cause.replace('_', ' ')}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{last_diagnosis.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4">
        <Link 
          to={`/report/${field.field_id}`}
          className="w-full flex items-center justify-between bg-canesense-green hover:bg-[#15362a] text-white p-4 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95"
        >
          <span>Report a problem</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
        
        <button className="w-full mt-3 text-canesense-green font-semibold py-3 hover:bg-green-50 rounded-xl transition-colors">
          Register new field
        </button>
      </div>
    </div>
  );
}
