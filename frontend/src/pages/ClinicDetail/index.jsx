import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClinic } from "../../utils/api";
import { ArrowLeft } from "lucide-react";

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getClinic(id);
        setClinic(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!clinic) return <div className="p-4">Not found</div>;

  const { name, rating, address, phone, hours, coordinates } = clinic;
  const lat = Number(coordinates?.lat || 0);
  const lng = Number(coordinates?.lng || 0);
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="min-h-full bg-[#0D0D0D] p-10">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/clinics")}
          className="group flex items-center gap-3 text-[#E5E0DA]/40 hover:text-[#C5A059] transition-all"
        >
          <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Control Panel Nexus</span>
        </button>

        {/* Header Section */}
        <div className="bg-[#1A1A1A] rounded-[40px] border border-white/5 p-10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 blur-3xl rounded-full"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Node Identity
              </div>
              <h1 className="text-3xl font-bold text-[#F9F8F6] uppercase tracking-tight leading-tight">{name}</h1>
              
              <div className="space-y-4">
                <div className="text-[11px] font-bold text-[#C5A059]/60 uppercase tracking-widest">
                  Rating: <span className="text-[#F9F8F6] ml-2">{rating || 0}</span>
                </div>
                <div className="text-[#E5E0DA]/40 text-sm font-light leading-relaxed max-w-md">
                  {address}
                </div>
                <div className="text-[#E5E0DA]/40 text-sm font-light">
                  Direct Line: <span className="text-[#F9F8F6] ml-2">{phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Hours Section */}
          <div className="bg-[#1A1A1A] rounded-[40px] border border-white/5 p-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xs font-bold text-[#F9F8F6] uppercase tracking-[0.3em]">Operational Phase</h2>
            </div>
            <div className="space-y-1">
              {(hours || []).map((h, idx) => (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 border-white/5">
                  <span className="text-xs font-bold text-[#F9F8F6]/60 uppercase tracking-widest">{h.day}</span>
                  <span className="text-xs font-light text-[#E5E0DA]/80 tracking-wide uppercase">{h.label}</span>
                </div>
              ))}
              {(!hours || hours.length === 0) && <div className="text-[#E5E0DA]/20 text-[10px] uppercase italic">Data field empty</div>}
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-[#1A1A1A] rounded-[40px] border border-white/5 p-10 overflow-hidden">
            <h2 className="text-xs font-bold text-[#F9F8F6] uppercase tracking-[0.3em] mb-8">Geospatial Node</h2>
            <div className="w-full h-80 rounded-[30px] overflow-hidden grayscale invert-[0.9] border border-white/5">
              <iframe
                title="map"
                src={mapSrc}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ClinicDetail;
