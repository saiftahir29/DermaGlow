import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listClinics } from "../../utils/api";
import { MapPin, Phone, Star, Clock } from "lucide-react";

const ExploreClinics = () => {
  const [data, setData] = useState({ items: [], page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await listClinics({ page: 1, limit: 50 });
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-full bg-[#0D0D0D] p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Clinical Network
          </div>
          <h1 className="text-3xl font-bold text-[#F9F8F6] uppercase tracking-tight">Explore Clinics</h1>
          <p className="mt-4 text-[#E5E0DA]/40 text-sm font-light">Find authorized skincare matrix nodes near your proximity</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
             <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin"></div>
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/10">Scanning Grid...</span>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((c) => (
              <div
                key={c.id}
                className="group bg-[#1A1A1A] rounded-[32px] border border-white/5 hover:border-[#C5A059]/30 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col h-full"
                onClick={() => navigate(`/clinic/${c.id}`)}
              >
                <div className="p-8 space-y-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-[#F9F8F6] uppercase tracking-wider group-hover:text-[#C5A059] transition-colors leading-tight">{c.name}</h3>
                    {c.rating > 0 && (
                      <div className="flex items-center gap-1.5 bg-[#C5A059]/10 border border-[#C5A059]/20 px-3 py-1.5 rounded-full flex-shrink-0">
                        <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />
                        <span className="text-[10px] font-bold text-[#C5A059]">{c.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 flex-grow">
                    {c.address && (
                      <div className="flex items-start gap-4 text-[11px] text-[#E5E0DA]/40 font-light leading-relaxed">
                        <MapPin size={16} className="text-[#C5A059]/50 flex-shrink-0" />
                        <span className="line-clamp-2">{c.address}</span>
                      </div>
                    )}

                    {c.phone && (
                      <div className="flex items-center gap-4 text-[11px] text-[#E5E0DA]/40 font-light">
                        <Phone size={16} className="text-[#C5A059]/50 flex-shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                    )}

                    {c.hours && c.hours.length > 0 && (
                      <div className="flex items-start gap-4 text-[11px] text-[#E5E0DA]/40 font-light">
                        <Clock size={16} className="text-[#C5A059]/50 flex-shrink-0" />
                        <div className="uppercase tracking-widest font-bold text-[9px]">
                          {c.hours[0]?.label && (
                            <span>{c.hours[0].label}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clinic/${c.id}`);
                    }}
                    className="w-full mt-6 px-6 py-4 bg-white/5 text-[#F9F8F6] rounded-2xl group-hover:bg-[#C5A059] group-hover:text-[#0D0D0D] transition-all duration-500 font-bold text-[10px] tracking-[0.3em] uppercase border border-white/5 group-hover:border-[#C5A059]"
                  >
                    Assess Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && data.items.length === 0 && (
          <div className="text-center py-24 bg-[#1A1A1A] rounded-[40px] border border-white/5 mt-10">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/10 italic">No nodes identified in current sector</p>
          </div>
        )}
      </div>
    </div>

  );
};

export default ExploreClinics;
