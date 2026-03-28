import React, { useEffect, useState } from "react";
import { listClinics, deleteClinic } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Star, MapPin, Phone, Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { confirmationAlert } from "../../utils/swal";

const ClinicsList = () => {
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

  const onDelete = async (id) => {
    confirmationAlert(
      async () => {
        try {
          await deleteClinic(id);
          load();
        } catch (error) {
          console.error("Error deleting clinic:", error);
        }
      },
      "Are you sure you want to delete this clinic? This action cannot be undone."
    );
  };

  return (
    <div className="h-full bg-[#0D0D0D] p-10 scrollbar-none relative overflow-hidden">
      {/* Background Decor */}

      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12">
          <div>
            <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Clinical Network Management
            </div>
            <h1 className="text-3xl font-bold text-[#F9F8F6] uppercase tracking-tight">Node Directory</h1>
            <p className="mt-2 text-[#E5E0DA]/40 text-sm font-light">Monitor and configure authorized skincare nodes within the matrix</p>
          </div>
          <Link
            to="/admin/clinics/new"
            className="flex items-center gap-3 px-8 py-4 bg-[#C5A059] text-[#0D0D0D] rounded-full hover:bg-[#F9F8F6] transition-all duration-500 shadow-[0_10px_30px_rgba(197,160,89,0.2)] font-bold text-[10px] tracking-[0.3em] uppercase"
          >
            <Plus size={18} />
            <span>Initialize New Node</span>
          </Link>
        </div>

        {/* Clinics List */}
        {loading ? (
          <div className="bg-[#1A1A1A] rounded-[40px] border border-white/5 p-24 flex flex-col items-center justify-center shadow-2xl">
             <div className="w-12 h-12 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin mb-6"></div>
             <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/10">Synchronizing Grid...</p>
          </div>
        ) : data.items.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-[40px] border border-white/5 p-24 text-center shadow-2xl">
            <Building2 className="text-[#C5A059]/20 mx-auto mb-8" size={64} />
            <h3 className="text-xl font-bold text-[#F9F8F6] uppercase tracking-wider mb-4">No active nodes identified</h3>
            <p className="text-[#E5E0DA]/40 mb-10 max-w-xs mx-auto text-sm font-light">The clinical sector is currently devoid of registered infrastructure.</p>
            <Link
              to="/admin/clinics/new"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-[#F9F8F6] rounded-full hover:bg-[#C5A059] hover:text-[#0D0D0D] hover:border-[#C5A059] transition-all duration-500 font-bold text-[10px] tracking-[0.3em] uppercase"
            >
              <Plus size={18} />
              <span>Register Primary Node</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((c) => (
              <div
                key={c.id}
                className="group bg-[#1A1A1A] rounded-[32px] border border-white/5 hover:border-[#C5A059]/30 transition-all duration-500 overflow-hidden shadow-xl flex flex-col h-full"
              >
                <div className="p-8 space-y-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-[#F9F8F6] uppercase tracking-wider group-hover:text-[#C5A059] transition-colors leading-tight line-clamp-2">{c.name}</h3>
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
                        <MapPin size={16} className="text-[#C5A059]/30 flex-shrink-0" />
                        <span className="line-clamp-2">{c.address}</span>
                      </div>
                    )}
                    {c.phone && (
                      <div className="flex items-center gap-4 text-[11px] text-[#E5E0DA]/40 font-light">
                        <Phone size={16} className="text-[#C5A059]/30 flex-shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-white/5">
                    <button
                      onClick={() => navigate(`/admin/clinics/${c.id}`)}
                      className="p-3 bg-white/5 text-[#F9F8F6]/60 rounded-2xl hover:bg-[#C5A059] hover:text-[#0D0D0D] transition-all duration-300 border border-white/5"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/clinics/${c.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-white/5 text-[#F9F8F6] rounded-2xl hover:bg-[#F9F8F6] hover:text-[#0D0D0D] transition-all duration-300 font-bold text-[9px] tracking-[0.3em] uppercase border border-white/5"
                    >
                      <Edit size={16} />
                      <span>Reconfigure</span>
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      className="p-3 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default ClinicsList;


