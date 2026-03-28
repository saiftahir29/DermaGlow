import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClinic } from "../../utils/api";
import { MapPin, Phone, Star, Clock, ArrowLeft, User } from "lucide-react";

const UserClinicDetail = () => {
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

  if (loading) return <div className="h-full flex items-center justify-center text-[#5C6748]">Loading...</div>;
  if (!clinic) return <div className="h-full flex items-center justify-center text-[#5C6748]">Clinic not found</div>;

  const { name, rating, address, phone, hours, coordinates, doctors } = clinic;
  const lat = Number(coordinates?.lat || 0);
  const lng = Number(coordinates?.lng || 0);
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="min-h-full overflow-y-auto bg-[#0D0D0D] p-10 scrollbar-thin scrollbar-thumb-[#C5A059]/10 scrollbar-track-transparent">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/explore-clinics")}
          className="group flex items-center gap-3 text-[#E5E0DA]/40 hover:text-[#C5A059] transition-all"
        >
          <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Clinical Network Registry</span>
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
                {address && (
                  <div className="flex items-start gap-4 text-[#E5E0DA]/40 text-sm font-light leading-relaxed max-w-md">
                    <MapPin size={20} className="text-[#C5A059]/50 flex-shrink-0" />
                    <span>{address}</span>
                  </div>
                )}

                {phone && (
                  <div className="flex items-center gap-4 text-[#E5E0DA]/40 text-sm font-light">
                    <Phone size={20} className="text-[#C5A059]/50 flex-shrink-0" />
                    <span>{phone}</span>
                  </div>
                )}
              </div>
            </div>

            {rating > 0 && (
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-[28px] min-w-[120px]">
                <Star size={32} className="text-[#C5A059] fill-[#C5A059] mb-3" />
                <span className="text-2xl font-bold text-[#F9F8F6]">{rating}</span>
                <span className="text-[10px] font-bold text-[#C5A059]/60 uppercase tracking-widest mt-1">Integrity Score</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Hours Section */}
          {hours && hours.length > 0 && (
            <div className="bg-[#1A1A1A] rounded-[40px] border border-white/5 p-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-[#2D2D2D] rounded-2xl flex items-center justify-center">
                  <Clock size={20} className="text-[#C5A059]" />
                </div>
                <h2 className="text-xs font-bold text-[#F9F8F6] uppercase tracking-[0.3em]">Operational Phase</h2>
              </div>
              <div className="space-y-1 mt-auto">
                {hours.map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/2">
                    <span className="text-xs font-bold text-[#F9F8F6]/60 uppercase tracking-widest">{h.day}</span>
                    <span className="text-xs font-light text-[#E5E0DA]/80 tracking-wide uppercase">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctors Section */}
          {doctors && doctors.length > 0 && (
            <div className="bg-[#1A1A1A] rounded-[40px] border border-white/5 p-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-[#2D2D2D] rounded-2xl flex items-center justify-center">
                  <User size={20} className="text-[#C5A059]" />
                </div>
                <h2 className="text-xs font-bold text-[#F9F8F6] uppercase tracking-[0.3em]">Specialist Cadre</h2>
              </div>
              <div className="space-y-4 mt-auto">
                {doctors.map((d, idx) => (
                  <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-[#C5A059]/30 transition-all duration-500">
                    <div className="font-bold text-[#F9F8F6] uppercase tracking-wider text-sm group-hover:text-[#C5A059] transition-colors">{d.name}</div>
                    {d.specialty && (
                      <div className="text-[10px] font-bold text-[#C5A059]/40 uppercase tracking-[0.2em] mt-2 italic">{d.specialty}</div>
                    )}
                    {d.phone && (
                      <div className="text-[10px] text-[#E5E0DA]/30 uppercase tracking-widest mt-4 flex items-center gap-2">
                        <Phone size={12} className="opacity-50" />
                        {d.phone}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map Section */}
        {lat !== 0 && lng !== 0 && (
          <div className="bg-[#1A1A1A] rounded-[40px] border border-white/5 p-10 overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-[#2D2D2D] rounded-2xl flex items-center justify-center">
                <MapPin size={20} className="text-[#C5A059]" />
              </div>
              <h2 className="text-xs font-bold text-[#F9F8F6] uppercase tracking-[0.3em]">Geospatial Node</h2>
            </div>
            <div className="w-full h-[400px] rounded-[30px] overflow-hidden grayscale invert-[0.9] hover:grayscale-0 transition-all duration-1000 border border-white/5">
              <iframe
                title="map"
                src={mapSrc}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default UserClinicDetail;
