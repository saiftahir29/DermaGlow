import React, { useState } from 'react';
import { CheckCircle, Clock, Mail } from 'lucide-react';
import { failureToaster, successToaster } from '../../utils/swal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Forgot Password Component
export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format. e.g example@example.com");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/api/auth/send/verify-link/${email}`);
      successToaster("Verification link sent successfully.");
      setSent(true);
      setResendTimer(30); // Start 30-second cooldown for resend

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      failureToaster(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#0D0D0D] flex items-center justify-center p-4 relative overflow-y-auto selection:bg-[#C5A059] selection:text-[#0D0D0D]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg bg-[#1A1A1A] border border-white/5 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] p-8 md:p-12">
        {/* Header */}
        <div className="mb-10 text-center">
           <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Recovery Protocol
           </div>
           <h2 className="text-2xl font-bold tracking-tight text-[#F9F8F6] uppercase">
             Restore Access
           </h2>
           <p className="mt-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#E5E0DA]/40">
             Initiating link transmission to verified link
           </p>
        </div>

        <div>
          {sent ? (
            <div className="space-y-8">
              <div className="flex items-center justify-center">
                 <div className="relative">
                    <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-[#C5A059]/10 border border-[#C5A059]/20 p-4 rounded-full">
                       <CheckCircle className="h-8 w-8 text-[#C5A059]" />
                    </div>
                 </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                <Mail className="h-5 w-5 text-[#C5A059] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#F9F8F6]/80 leading-relaxed font-light">
                    A secure authentication link has been dispatched to 
                    <span className="block mt-1 font-bold text-[#C5A059] tracking-wider uppercase text-xs">{email}</span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-6 pt-4 border-t border-white/5 font-light text-[11px] tracking-wide text-[#E5E0DA]/30 text-center italic">
                <p>Ensure to inspect your communications log (including spam partitions).</p>
                
                <div className="pt-2">
                  {resendTimer > 0 ? (
                    <div className="flex items-center justify-center text-[#C5A059]/40 gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Sync cooldown active: <span className="font-bold">{resendTimer}s</span></span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-4 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase text-[#0D0D0D] bg-[#C5A059] hover:bg-[#F9F8F6] transition-all duration-300 shadow-[0_10px_30px_rgba(197,160,89,0.2)]"
                    >
                      {loading ? "Transmitting..." : "Resend Protocol"}
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center">
                 <Link to="/login" className="text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/20 hover:text-[#C5A059] transition-colors">
                    Back to Entry
                 </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-3 ml-2">
                  Verify Identity
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:text-[#C5A059] transition-colors">
                    <Mail className="h-4 w-4 text-[#F9F8F6]/20" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/10 font-light text-sm"
                    placeholder="email@nexus.com"
                  />
                </div>
                {error && <p className="text-[#C5A059] text-[10px] mt-3 ml-2 font-bold tracking-tighter italic lowercase">{error}</p>}
              </div>

              <div className="pt-4 flex flex-col gap-6">
                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full py-5 rounded-full text-xs font-bold tracking-[0.3em] uppercase text-[#0D0D0D] bg-[#C5A059] hover:bg-[#F9F8F6] transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)]"
                 >
                   {loading ? "Transmitting..." : "Dispatch Link"}
                 </button>

                 <div className="text-center">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/20">
                      Recalled access? <Link to="/login" className="text-[#C5A059] hover:text-[#F9F8F6]">Enter Nexus</Link>
                    </p>
                 </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>

  );
};

export default ForgotPassword;