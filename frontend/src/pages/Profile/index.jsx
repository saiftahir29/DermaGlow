import React, { useEffect, useState } from 'react';
import { Mail, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { failureToaster, successToaster } from '../../utils/swal';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    age: '',
    location: '',
  });

  const [loading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };


   const updateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put('http://localhost:8000/api/user/update-profile', profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (response.data.data) {
        // Update localStorage with new data
        const updatedUserInfo = { ...JSON.parse(localStorage.getItem("userInfo")), ...profileData };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        
        // Update state
        setProfileData({
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          skinTone: profileData.skinTone
        });
        
        // Show success message
        successToaster('Profile updated successfully');
        }
    } catch (error) {
      console.error('Error updating profile:', error);
      failureToaster(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
    };

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("userInfo"));        
      setProfileData({
          fullName: userData?.fullName || '',
          email: userData?.email || '',  
          age: userData?.age || '',
          location: userData?.location || '',
        });
      }
    , []);


  return (
    <div className="min-h-full bg-[#0D0D0D] py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto bg-[#1A1A1A] rounded-[40px] border border-white/5 shadow-2xl relative z-10">
        {/* Header Section */}
        <div className="px-10 py-10 bg-white/5 border-b border-white/5">
          <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Identity Matrix
          </div>
          <h2 className="text-2xl font-bold text-[#F9F8F6] uppercase tracking-wider">
            Profile Protocol
          </h2>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-[#E5E0DA]/40 uppercase tracking-widest font-bold">
              Synchronize your biological and clinical parameters
            </p>
            <Link 
              to="/home#methodology" 
              className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase text-[#C5A059] hover:text-[#F9F8F6] transition-all"
            >
              <HelpCircle size={12} /> Our Methodology
            </Link>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-10 py-12">
          <form onSubmit={updateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#F9F8F6]/40 mb-3 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                             transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                    placeholder="Enter verified name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#F9F8F6]/40 mb-3 ml-1">
                    Temporal Age (Years)
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    min={10}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                             transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                    placeholder="Enter age"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#F9F8F6]/40 mb-3 ml-1">
                    Geospatial Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-[#0D0D0D] border border-white/5 text-[#F9F8F6] focus:border-[#C5A059]/50 
                             transition-all outline-none text-sm placeholder:text-white/10 font-light tracking-wide"
                    placeholder="Enter city / sector"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#F9F8F6]/40 mb-3 ml-1">
                    Electronic Mail Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                      <Mail size={16} className="text-[#C5A059]/40" />
                    </div>
                    <input
                      readOnly
                      name="email"
                      value={profileData.email}
                      className="w-full pl-16 pr-6 py-4 rounded-2xl bg-[#0D0D0D]/50 border border-white/5 text-[#F9F8F6]/40
                               outline-none text-sm font-light tracking-wide"
                      placeholder="Email link"
                    />
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
                {loading ? (
                  <div className="flex space-x-2">
                    <div className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  'Commit Updates'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default Profile;