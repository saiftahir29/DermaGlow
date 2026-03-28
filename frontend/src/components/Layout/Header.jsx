import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token =localStorage.getItem("token");

  const onLogOut = () => {
    localStorage.setItem("token", null)
    localStorage.setItem("userInfo", null)
    navigate("/home")
  }

  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <header className="bg-transparent backdrop-blur-md border-b border-white/5 p-4 flex justify-end items-center relative z-20">
      <div className="relative">
       {token && (<div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-3">
             <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C5A059] opacity-50">Auth Verified</span>
             <span className="text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/80">{user.fullName || "John Doe"}</span>
          </div>
          <div 
            className="w-10 h-10 rounded-full border border-[#C5A059]/30 flex items-center justify-center cursor-pointer hover:bg-[#C5A059]/10 transition-all duration-300 overflow-hidden"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <User size={20} className="text-[#C5A059]" />
          </div>
        </div>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-4 w-64 bg-[#1A1A1A] border border-white/10 rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
            <div className="p-6 border-b border-white/5 text-center bg-white/5">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C5A059]/20">
                 <User size={24} className="text-[#C5A059]" />
              </div>
              <h4 className="font-bold text-[#F9F8F6] tracking-widest uppercase text-xs">{user.fullName || "John Doe"} </h4>
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#C5A059] mt-1">Premium Identity</p>
            </div>
            <div className="p-3">
              <Link to="/profile" className="flex items-center px-4 py-3 text-[#F9F8F6]/60 hover:text-[#C5A059] hover:bg-white/5 rounded-xl transition-all duration-300" onClick={() => setDropdownOpen(false)}>
                <User size={16} className="mr-3" />
                <span className="text-[11px] font-bold tracking-widest uppercase">Profile Matrix</span>
              </Link>
              <button className="w-full flex items-center px-4 py-3 text-[#F9F8F6]/60 hover:text-red-500 hover:bg-white/5 rounded-xl transition-all duration-300" onClick={() => onLogOut()}>
                <LogOut size={16} className="mr-3" />
                <span className="text-[11px] font-bold tracking-widest uppercase">Terminate Session</span>
              </button>
            </div>
          </div>
        )}
        </div>
  )}

        {!token && (
          <Link to="/login" className='text-[10px] font-bold tracking-[0.4em] uppercase text-[#C5A059] hover:text-[#F9F8F6] transition-all px-6 py-2 border border-[#C5A059]/30 rounded-full'>
            Entry Required
          </Link>
        )}
      </div>
    </header>

  );
};

export default Header;
