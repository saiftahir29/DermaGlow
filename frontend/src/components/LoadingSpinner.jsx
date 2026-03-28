import React from 'react';
import { Droplet } from 'lucide-react';

const SkinSmartLoader = () => {
  return (
    <div className="fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-[100] selection:bg-[#C5A059] selection:text-[#0D0D0D]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative flex flex-col items-center">
        {/* Glowing Orb Loader */}
        <div className="relative w-24 h-24 mb-10">
          <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-full h-full border border-[#C5A059]/20 rounded-full flex items-center justify-center bg-[#1A1A1A] backdrop-blur-md shadow-2xl">
            <Droplet size={32} className="text-[#C5A059] animate-bounce" />
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C5A059] animate-pulse">Synchronizing</p>
          <div className="flex justify-center gap-2">
            <div className="w-1 h-1 bg-[#F9F8F6]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-[#F9F8F6]/40 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-1 h-1 bg-[#F9F8F6]/40 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
          <p className="text-[9px] text-white/20 font-light tracking-[0.3em] uppercase">Biological Signature Accessing...</p>
        </div>
      </div>
    </div>

  );
};

export default SkinSmartLoader;