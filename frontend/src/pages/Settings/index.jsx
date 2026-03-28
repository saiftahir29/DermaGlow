import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { failureToaster, successToaster } from '../../utils/swal';
import axios from 'axios';

const Settings = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  
  // Validate passwords before submission
  const validatePasswords = () => {
    let isValid = true;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const newErrors = {};
  
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }
  
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (!passwordPattern.test(passwordData.newPassword)) { 
      // FIX: The condition should check if the password does NOT match the pattern
      newErrors.newPassword = "Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character";
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for the field being changed
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };


  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };


  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    if (!validatePasswords()) return;

    setPasswordUpdateStatus("loading");
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:8000/api/user/update-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordUpdateStatus("success");
      successToaster("Password changed successfully");

      // Clear form after successful update
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      setPasswordUpdateStatus(null);

      const errorMessage = error.response?.data?.message || "Something went wrong";
      setErrors((prev) => ({ ...prev, server: errorMessage }));
      failureToaster(errorMessage);
    }
  };

  return (
    <div className="min-h-full bg-[#0D0D0D] py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto bg-[#1A1A1A] rounded-[40px] border border-white/5 shadow-2xl relative z-10">
        {/* Header Section */}
        <div className="px-10 py-10 bg-white/5 border-b border-white/5">
          <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Security Matrix
          </div>
          <h2 className="text-2xl font-bold text-[#F9F8F6] uppercase tracking-wider">
            Access Encryption
          </h2>
          <p className="mt-2 text-xs text-[#E5E0DA]/40 uppercase tracking-widest font-bold">
            Update your account authentication credentials
          </p>
        </div>

        {/* Form Section */}
        <div className="px-10 py-12">
          <form onSubmit={handlePasswordSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#F9F8F6]/40 mb-3 ml-1">
                    Current Authentication Key
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                      <Lock size={16} className="text-[#C5A059]/40" />
                    </div>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full pl-16 pr-12 py-4 rounded-2xl bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                               transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                      placeholder="Enter active secret"
                    />
                    {errors.currentPassword && (
                      <p className="mt-2 text-[10px] text-red-400/80 uppercase tracking-wider font-bold ml-1">{errors.currentPassword}</p>
                    )}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 px-2 flex items-center text-[#C5A059]/40 hover:text-[#C5A059] transition-colors"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? 
                        <EyeOff size={18} /> : 
                        <Eye size={18} />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#F9F8F6]/40 mb-3 ml-1">
                    New Security Cipher
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                      <Lock size={16} className="text-[#C5A059]/40" />
                    </div>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handleInputChange}
                      className="w-full pl-16 pr-12 py-4 rounded-2xl bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                               transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                      placeholder="Enter new protocol"
                    />
                    {errors.newPassword && (
                      <p className="mt-2 text-[10px] text-red-400/80 uppercase tracking-wider font-bold ml-1 leading-relaxed">{errors.newPassword}</p>
                    )}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 px-2 flex items-center text-[#C5A059]/40 hover:text-[#C5A059] transition-colors"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? 
                        <EyeOff size={18} /> : 
                        <Eye size={18} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Button Section - Full Width */}
            <div className="mt-12">
              <button
                type="submit"
                className="w-full flex justify-center items-center px-10 py-5 rounded-[22px] text-[11px] font-bold tracking-[0.4em] uppercase text-[#0D0D0D]
                         bg-[#C5A059] hover:bg-[#F9F8F6] transition-all duration-500 shadow-[0_10px_30px_rgba(197,160,89,0.2)]"
              >
                Terminate & Renew Cipher
              </button>
            </div>
          </form>
          {errors.server &&
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest mt-8">
              System Error: {errors.server}
            </div>
          }
        </div>
      </div>
    </div>

  );
};

export default Settings;