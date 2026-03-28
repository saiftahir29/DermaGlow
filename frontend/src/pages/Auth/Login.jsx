import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { successToaster } from "./../../utils/swal";
import  axios  from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = `Invalid email format\n e.g. example@gmail.com`;
    }
  
 
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!validateForm()) return;

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        formData
      );
      successToaster("Login Successful");
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data.data));
       console.log("Response", response.data.data);
      if(response.data.data.role === "admin") {
        console.log("Admin");
        navigate("/admin");
      } else {
        console.log("User");
        navigate("/");
      }
    } catch (error) {
      console.log("Error", error);
      if (error.response && error.response.data) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // Extract name and value from the event
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
  };
  
  return (
    <div className="relative min-h-full bg-[#0D0D0D] flex items-center justify-center p-4 overflow-y-auto selection:bg-[#C5A059] selection:text-[#0D0D0D]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#C5A059]/3 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl bg-[#1A1A1A] border border-white/5 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col md:flex-row my-10">
        {/* Visual Side */}
        <div className="hidden md:block md:w-1/2 relative bg-[#151515] p-12 flex flex-col justify-between border-r border-white/5">
           <div>
             <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Secure Portal
             </div>
             <h2 className="text-4xl font-bold tracking-tight text-[#F9F8F6] leading-[1.1]">
               Access your <span className="text-[#C5A059] italic font-serif">Aura.</span>
             </h2>
             <p className="mt-8 text-sm text-[#E5E0DA]/40 leading-relaxed font-light tracking-wide max-w-[240px]">
               Initializing secondary sync with your skin's unique molecular profile.
             </p>
           </div>
           
           <div className="mt-auto">
             <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase opacity-20">
               <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></div>
               <span>AI Core Integrity Verified</span>
             </div>
           </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-10 md:p-16">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#F9F8F6] tracking-wide uppercase">Derma Glow</h1>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#C5A059]/60 mt-2">Dermatological Logic</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-3"
              >
                Identification
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/20 font-light text-sm"
                placeholder="email@nexus.com"
              />
              {errors.email && (
                <p className="text-[#C5A059] text-[10px] mt-2 font-bold tracking-tighter italic lowercase">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-3"
              >
                Secret Key
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/20 font-light text-sm pr-14"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#C5A059] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#C5A059] text-[10px] mt-2 font-bold tracking-tighter italic lowercase">{errors.password}</p>
              )}
              {serverError && (
                <p className="text-[#C5A059] text-[10px] mt-2 font-bold tracking-tighter italic lowercase">{serverError}</p>
              )}
            </div>

            <div className="pt-4 flex flex-col gap-6">
              <button
                type="submit"
                className="w-full bg-[#C5A059] text-[#0D0D0D] py-5 rounded-full text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#F9F8F6] transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)]"
              >
                Authenticate
              </button>
              
              <div className="flex justify-between items-center px-2">
                <Link
                  to="/forgot-Password"
                  className="text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/30 hover:text-[#C5A059] transition-colors"
                >
                  Lost Access?
                </Link>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/30">
                  New? <Link to="/signup" className="text-[#C5A059] hover:text-[#F9F8F6]">Form Identity</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default Login;
