import React, { useState } from "react";
import { X, Cloud, Thermometer, Droplets, Wind } from "lucide-react";
import MarkdownRenderer from "../MarkdownRenderer";
import { getWeatherRecommendation } from "../../utils/api";

const WeatherRecommendationModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { weather, recommendation } = data;
  const [editing, setEditing] = useState(false);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState({ weather, recommendation });

  const applyCity = async () => {
    if (!city.trim()) return;
    try {
      setLoading(true);
      const res = await getWeatherRecommendation({ city: city.trim() });
      localStorage.setItem("weatherRecData", JSON.stringify(res));
      setLocalData(res);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#A2AA7B] to-[#8B936A] text-white p-4 rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Today's Skincare Tip</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Weather Info */}
        <div className="p-4 border-b bg-[#F5F7F0]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <Thermometer size={18} className="text-[#A2AA7B]" />
              <div>
                <div className="text-xs text-gray-600">Temperature</div>
                <div className="text-sm font-semibold text-[#5C6748]">{localData.weather.temperature}°C</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets size={18} className="text-[#A2AA7B]" />
              <div>
                <div className="text-xs text-gray-600">Humidity</div>
                <div className="text-sm font-semibold text-[#5C6748]">{localData.weather.humidity}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Cloud size={18} className="text-[#A2AA7B]" />
              <div>
                <div className="text-xs text-gray-600">Condition</div>
                <div className="text-sm font-semibold text-[#5C6748] capitalize">{localData.weather.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind size={18} className="text-[#A2AA7B]" />
              <div>
                <div className="text-xs text-gray-600">Wind</div>
                <div className="text-sm font-semibold text-[#5C6748]">{localData.weather.windSpeed} m/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Content */}
        <div className="p-6">
          <div className="markdown-content">
            <MarkdownRenderer content={localData.recommendation} />
          </div>
        </div>

        {/* Change location */}
        <div className="px-6 pb-2">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="text-sm text-[#5C6748] underline">Not your area? Change location</button>
          ) : (
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city (e.g., Gujrat)"
                className="border rounded p-2 w-full md:w-64"
              />
              <div className="flex gap-2">
                <button disabled={loading} onClick={applyCity} className="px-3 py-2 bg-[#A2AA7B] text-white rounded">Apply</button>
                <button onClick={() => setEditing(false)} className="px-3 py-2 border rounded">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#A2AA7B] text-white rounded-lg hover:bg-[#8B936A] transition-colors font-medium"
          >
            {loading ? 'Loading...' : 'Got it, thanks!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherRecommendationModal;

