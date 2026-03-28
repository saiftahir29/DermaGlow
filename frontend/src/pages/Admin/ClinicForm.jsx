import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createClinic, getClinic, updateClinic } from "../../utils/api";
import { ArrowLeft } from "lucide-react";

const defaultHours = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => ({ day, open24h: true, opensAt: "", closesAt: "" }));

const normalizePhone = (val) => val.replace(/[^0-9+]/g, "");
// Basic Pakistan validation: allows +92XXXXXXXXXX or 03XXXXXXXXX or 0XXXXXXXXXX (landline)
const isValidPakistanPhone = (val) => {
  const digits = val.replace(/\D/g, "");
  // +92 format
  if (/^\+?92\d{10}$/.test(val.replace(/\D/g, "").replace(/^92/, "+92"))) return true;
  // Mobile 03XXXXXXXXX (11 digits)
  if (/^03\d{9}$/.test(digits)) return true;
  // Landline: 0 + 2-3 digit area + 7-8 digits
  if (/^0\d{10,11}$/.test(digits)) return true;
  return false;
};

const ClinicForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    address: "",
    coordinates: { lat: 0, lng: 0 },
    phone: "",
    hours: defaultHours,
    doctors: [],
  });
  const [doctor, setDoctor] = useState({ name: "", specialty: "", phone: "" });

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      const data = await getClinic(id);
      // Parse stored hours (day + label) into UI format
      const uiHours = (data.hours || []).map(h => {
        const label = h.label || "";
        if (/open 24 hours/i.test(label)) {
          return { day: h.day, open24h: true, opensAt: "", closesAt: "" };
        }
        const parts = label.split(/\s*[–-]\s*/);
        return { day: h.day, open24h: false, opensAt: parts[0] || "", closesAt: parts[1] || "" };
      });
      setForm({
        name: data.name || "",
        rating: data.rating || 0,
        address: data.address || "",
        coordinates: {
          lat: data.coordinates?.lat !== undefined ? String(data.coordinates.lat) : "",
          lng: data.coordinates?.lng !== undefined ? String(data.coordinates.lng) : "",
        },
        phone: data.phone || "",
        hours: uiHours.length ? uiHours : defaultHours,
        doctors: data.doctors || [],
      });
    };
    load();
  }, [id, isEdit]);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    const phoneOk = isValidPakistanPhone(form.phone || "");
    if (!phoneOk) {
      setErrors(prev => ({ ...prev, phone: "Enter a valid Pakistani phone number (mobile or landline)." }));
      return;
    }

    // Map UI hours to stored label form
    const mappedHours = (form.hours || []).map(h => ({
      day: h.day,
      label: h.open24h ? "Open 24 hours" : `${h.opensAt || ""} – ${h.closesAt || ""}`.trim(),
    }));

    const latNum = parseFloat(form.coordinates.lat);
    const lngNum = parseFloat(form.coordinates.lng);
    const payload = {
      ...form,
      coordinates: { lat: isNaN(latNum) ? 0 : latNum, lng: isNaN(lngNum) ? 0 : lngNum },
      hours: mappedHours,
    };
    if (isEdit) await updateClinic(id, payload); else await createClinic(payload);
    navigate("/admin/clinics");
  };

  const addDoctor = () => {
    if (!doctor.name) return;
    setForm(prev => ({ ...prev, doctors: [ ...prev.doctors, doctor ] }));
    setDoctor({ name: "", specialty: "", phone: "" });
  };

  const removeDoctor = (idx) => {
    setForm(prev => ({ ...prev, doctors: prev.doctors.filter((_, i) => i !== idx) }));
  };

  const toggleOpen24 = (idx) => {
    const newHours = [ ...form.hours ];
    newHours[idx].open24h = !newHours[idx].open24h;
    setField("hours", newHours);
  };

  const setHour = (idx, key, value) => {
    const newHours = [ ...form.hours ];
    newHours[idx][key] = value;
    setField("hours", newHours);
  };

  return (
    <div className="h-full bg-[#0D0D0D] p-10 scrollbar-none relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/clinics")}
          className="group flex items-center gap-3 text-[#E5E0DA]/40 hover:text-[#C5A059] transition-all"
        >
          <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Control Panel Nexus</span>
        </button>

        <div className="mb-0">
          <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Node Configuration Protocol
          </div>
          <h1 className="text-3xl font-bold text-[#F9F8F6] uppercase tracking-tight">
            {isEdit ? "Reconfigure Node" : "Initialize Node"}
          </h1>
          <p className="mt-2 text-[#E5E0DA]/40 text-sm font-light">
            {isEdit ? "Update clinical node parameters and structural data" : "Deploy new clinical infrastructure into the matrix"}
          </p>
        </div>

        <form onSubmit={submit} className="bg-[#1A1A1A] rounded-[40px] border border-white/5 p-12 space-y-12 shadow-2xl">
          <div className="space-y-8">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059]">01. Primary Parameters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="col-span-full">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4 ml-1">Node Identity Name *</label>
                <input
                  value={form.name}
                  onChange={e => setField("name", e.target.value)}
                  className="w-full px-8 py-5 rounded-[22px] bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                           transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                  placeholder="Enter designated node name"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4 ml-1">Integrity Rating (0-5)</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '') { setField("rating", ''); return; }
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                      if (numValue < 0) setField("rating", 0);
                      else if (numValue > 5) setField("rating", 5);
                      else setField("rating", numValue);
                    }
                  }}
                  onBlur={e => {
                    if (e.target.value === '' || isNaN(parseFloat(e.target.value))) setField("rating", 0);
                  }}
                  className="w-full px-8 py-5 rounded-[22px] bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                           transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4 ml-1">Direct Secure Line *</label>
                <input
                  value={form.phone}
                  onChange={e => { setField("phone", normalizePhone(e.target.value)); setErrors(prev => ({ ...prev, phone: "" })); }}
                  className="w-full px-8 py-5 rounded-[22px] bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                           transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                  placeholder="e.g. 03XXXXXXXXX"
                />
                {errors.phone && <div className="text-red-400 text-[10px] mt-2 font-bold uppercase tracking-widest ml-1">{errors.phone}</div>}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4 ml-1">Physical Sector Address</label>
              <input
                value={form.address}
                onChange={e => setField("address", e.target.value)}
                className="w-full px-8 py-5 rounded-[22px] bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                         transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                placeholder="Enter physical deployment address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4 ml-1">Latitude</label>
                <input
                  inputMode="decimal"
                  type="text"
                  value={String(form.coordinates.lat ?? "")}
                  onChange={e => setField("coordinates", { ...form.coordinates, lat: e.target.value })}
                  className="w-full px-8 py-5 rounded-[22px] bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                           transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                  placeholder="e.g. 24.8607"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4 ml-1">Longitude</label>
                <input
                  inputMode="decimal"
                  type="text"
                  value={String(form.coordinates.lng ?? "")}
                  onChange={e => setField("coordinates", { ...form.coordinates, lng: e.target.value })}
                  className="w-full px-8 py-5 rounded-[22px] bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                           transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                  placeholder="e.g. 67.0011"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-6">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059]">02. Temporal Operational Phase</h2>
            <div className="space-y-4 bg-white/2 p-8 rounded-[32px] border border-white/5">
              {form.hours.map((h, idx) => (
                <div key={h.day} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="font-bold text-[#F9F8F6] uppercase tracking-widest text-xs">{h.day}</div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={h.open24h}
                      onChange={() => toggleOpen24(idx)}
                      className="w-5 h-5 bg-[#1A1A1A] border-white/10 rounded focus:ring-[#C5A059] accent-[#C5A059]"
                    />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 group-hover:text-[#F9F8F6] transition-colors">Open 24h</span>
                  </label>
                  {!h.open24h && (
                    <>
                      <input
                        type="time"
                        value={h.opensAt || ""}
                        onChange={e => setHour(idx, "opensAt", e.target.value)}
                        className="col-span-1.5 px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-xs outline-none focus:border-[#C5A059]/50"
                      />
                      <input
                        type="time"
                        value={h.closesAt || ""}
                        onChange={e => setHour(idx, "closesAt", e.target.value)}
                        className="col-span-1.5 px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-xs outline-none focus:border-[#C5A059]/50"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 pt-6">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059]">03. Specialist Personnel</h2>
            <div className="bg-white/2 p-8 rounded-[32px] border border-white/5 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <input
                  placeholder="Personnel Name"
                  value={doctor.name}
                  onChange={e => setDoctor({ ...doctor, name: e.target.value })}
                  className="px-6 py-4 rounded-xl bg-[#0D0D0D] border border-white/10 text-white text-xs outline-none focus:border-[#C5A059]/50"
                />
                <input
                  placeholder="Functional Specialty"
                  value={doctor.specialty}
                  onChange={e => setDoctor({ ...doctor, specialty: e.target.value })}
                  className="px-6 py-4 rounded-xl bg-[#0D0D0D] border border-white/10 text-white text-xs outline-none focus:border-[#C5A059]/50"
                />
                <input
                  placeholder="Comm Phone"
                  value={doctor.phone}
                  onChange={e => setDoctor({ ...doctor, phone: e.target.value })}
                  className="px-6 py-4 rounded-xl bg-[#0D0D0D] border border-white/10 text-white text-xs outline-none focus:border-[#C5A059]/50"
                />
                <button
                  type="button"
                  onClick={addDoctor}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-[#F9F8F6] rounded-xl hover:bg-[#C5A059] hover:text-[#0D0D0D] transition-all duration-300 font-bold text-[9px] tracking-[0.3em] uppercase"
                >
                  Induct Specialist
                </button>
              </div>
              
              {form.doctors.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {form.doctors.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 group hover:border-[#C5A059]/30 transition-all"
                    >
                      <div>
                        <div className="font-bold text-[#F9F8F6] uppercase tracking-wider text-xs mb-1">{d.name}</div>
                        <div className="text-[10px] font-bold text-[#C5A059]/40 uppercase tracking-widest italic leading-relaxed">
                          {d.specialty} {d.phone ? `• ${d.phone}` : ''}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDoctor(idx)}
                        className="p-2 text-red-400/40 hover:text-red-400 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-white/5">
            <button
              type="submit"
              className="flex-1 px-12 py-5 bg-[#C5A059] text-[#0D0D0D] rounded-[22px] hover:bg-[#F9F8F6] transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)] font-bold text-[11px] tracking-[0.4em] uppercase"
            >
              {isEdit ? "Commit Configuration" : "Initialize Infrastructure"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-12 py-5 border border-white/10 text-[#F9F8F6]/40 rounded-[22px] hover:bg-white/5 hover:text-[#F9F8F6] transition-all duration-500 font-bold text-[11px] tracking-[0.4em] uppercase"
            >
              Abort Protocol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default ClinicForm;


