import React from 'react';
import { Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="min-h-full flex items-center justify-center bg-[#0D0D0D] text-[#F9F8F6] relative overflow-y-auto py-20 px-4">
      {/* Abstract Background Blur */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Logo & Branding */}
      <div className="absolute top-12 left-12 z-20">
        <img
          src="/src/assets/derma_glow_final.png"
          alt="Derma-Glow"
          className="h-12 object-contain"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full mb-20 px-4">
          <div className="text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-8 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Neural Welcome
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-[#F9F8F6] leading-[1.05] mb-8 uppercase tracking-tighter">
              Authorized <br />
              <span className="text-[#C5A059] italic font-serif lowercase tracking-normal">Access.</span>
            </h1>
            <p className="text-xl text-[#E5E0DA]/60 max-w-md mx-auto lg:mx-0 leading-relaxed font-light mb-12">
              Welcome to your dedicated skincare matrix. Your biological data has been securely synchronized with our AI.
            </p>
          </div>
          {/* Illustration Section */}
          <div className="hidden lg:flex items-center justify-center">
             <div className="relative">
                <div className="absolute inset-0 bg-[#C5A059]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative w-64 h-64 border border-white/5 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-2xl">
                   <Droplet size={80} className="text-[#C5A059]/40 hover:text-[#C5A059] transition-colors duration-700" />
                </div>
             </div>
          </div>
        </div>

        {/* Features Grid - Minimal List */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 px-4">
           <span>Neural Analysis</span>
           <span>•</span>
           <span>Scientific Integrity</span>
           <span>•</span>
           <span>Tailored Logic</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full px-4 text-center">
          <Link
            to="/assessment"
            className="group relative inline-block px-10 py-4 text-sm font-bold tracking-widest uppercase text-[#0D0D0D] 
              bg-[#C5A059] hover:bg-[#F9F8F6]
              rounded-full shadow-2xl transition-all duration-300 w-full sm:w-auto"
          >
            Initiate Assessment
          </Link>
          
          <Link
            to="/explore-clinics"
            className="inline-block px-10 py-4 text-sm font-bold tracking-widest uppercase text-[#F9F8F6]
              bg-transparent border border-[#F9F8F6]/20 hover:bg-white/5
              rounded-full transition-all duration-300 w-full sm:w-auto"
          >
            Explore Clinics
          </Link>
        </div>

        {/* Status Text */}
        <p className="text-[9px] text-white/20 mt-16 tracking-[0.5em] uppercase font-mono px-4 text-center">
          System Status: Optimal connection to Atlas DB
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;