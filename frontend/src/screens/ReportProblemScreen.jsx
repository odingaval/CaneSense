import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Droplets, MapPin, Leaf, Loader2 } from 'lucide-react';
import SymptomPicklist from '../components/SymptomPicklist';
import { apiClient } from '../api/client';

export default function ReportProblemScreen() {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropStageWeeks: '20',
    symptom: '',
    location: 'Lower section',
    recentRain: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await apiClient.diagnose({
        field_id: fieldId,
        crop_stage_weeks: parseInt(formData.cropStageWeeks, 10),
        symptom: formData.symptom,
        location_in_field: formData.location,
        recent_rain: formData.recentRain,
        photo_url: null
      });
      
      // Pass result through router state
      navigate('/result', { state: { result, fieldId } });
    } catch (err) {
      console.error(err);
      alert('Failed to run diagnosis. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">What do you see?</h2>
        <p className="text-gray-500 text-sm">Tell us about the problem in your field.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Crop Stage */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <Leaf className="w-5 h-5 text-canesense-green" />
            Crop Stage (Weeks)
          </label>
          <input
            type="number"
            required
            min="1"
            max="104"
            value={formData.cropStageWeeks}
            onChange={(e) => setFormData({...formData, cropStageWeeks: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-canesense-green outline-none"
          />
        </div>

        {/* Symptoms */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-gray-700 font-semibold mb-3">Main Symptom</label>
          <SymptomPicklist 
            value={formData.symptom}
            onChange={(val) => setFormData({...formData, symptom: val})}
          />
        </div>

        {/* Location */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <MapPin className="w-5 h-5 text-canesense-green" />
            Where in the field?
          </label>
          <select 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-canesense-green outline-none"
          >
            <option>Whole field</option>
            <option>Lower section</option>
            <option>Upper section</option>
            <option>Patchy/scattered</option>
          </select>
        </div>

        {/* Rain */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <label className="flex items-center gap-2 text-gray-700 font-semibold">
            <Droplets className="w-5 h-5 text-blue-500" />
            Rain in last 7 days?
          </label>
          <button
            type="button"
            onClick={() => setFormData({...formData, recentRain: !formData.recentRain})}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${formData.recentRain ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${formData.recentRain ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Photo */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-dashed border-2 text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Add a photo (optional)</p>
          <p className="text-xs text-gray-400 mt-1">Tap to open camera</p>
          <input type="file" accept="image/*" className="hidden" />
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.symptom}
          className="w-full bg-canesense-green hover:bg-[#15362a] text-white p-4 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking your field...
            </>
          ) : (
            'Check my field'
          )}
        </button>
      </form>
    </div>
  );
}
