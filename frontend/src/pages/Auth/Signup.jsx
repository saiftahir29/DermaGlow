import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { successToaster } from "../../utils/swal";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [userNameError, setUserNameError] = useState('');


  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (password) => {
    // Password should be at least 8 characters, contain a number, uppercase letter, and special character.
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("Password must be at least 6 characters long, include a number, an uppercase letter, and a special character.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const validateUserName = (userName) => {
    if (userName === "") {
      setUserNameError("Please enter your full name.");
      return false;
    } else {
      setUserNameError("");
      return true;
    }
  };
  

  const handleSubmit = async(e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isUserNameValid = validateUserName(name);

    if (isEmailValid && isPasswordValid && isConfirmPasswordValid && isUserNameValid) {
      const payload = {
        name,
        email,
        password,
      };
      try {
        
        const response = await axios.post(
          "http://localhost:8000/api/auth/signup",
          payload
        );
        console.log("Signup Successful", response.data);
        navigate("/login");
        successToaster("Signup Successful");
      } catch (error) {
        if (error.response && error.response.data) {
          setServerError(error.response.data.message);
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      }
    }
  };

  return (
    <div className="relative min-h-full bg-[#0D0D0D] flex items-center justify-center p-4 overflow-y-auto selection:bg-[#C5A059] selection:text-[#0D0D0D]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#C5A059]/3 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl bg-[#1A1A1A] border border-white/5 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col md:flex-row my-10">
        {/* Form Side */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#F9F8F6] tracking-wide uppercase">Derma Glow</h1>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#C5A059]/60 mt-2">Create Identity</p>
          </div>

          <form className="space-y-6 flex-1" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-3">Civilian Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/20 font-light text-sm"
                  placeholder="Enter Full Name"
                />
                {userNameError && <p className="text-[#C5A059] text-[10px] mt-2 font-bold tracking-tighter italic lowercase">{userNameError}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-3">Communication Link</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/20 font-light text-sm"
                  placeholder="email@nexus.com"
                />
                {emailError && <p className="text-[#C5A059] text-[10px] mt-2 font-bold tracking-tighter italic lowercase">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-3">Secret Key</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/20 font-light text-sm pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#C5A059] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <p className="text-[#C5A059] text-[10px] mt-2 font-bold tracking-tighter italic lowercase">{passwordError}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-3">Verify Key</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/20 font-light text-sm"
                  placeholder="••••••••"
                />
                {confirmPasswordError && <p className="text-[#C5A059] text-[10px] mt-2 font-bold tracking-tighter italic lowercase">{confirmPasswordError}</p>}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#C5A059] text-[#0D0D0D] py-5 rounded-full text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#F9F8F6] transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)]"
              >
                Create Account
              </button>
              {serverError && <p className="text-[#C5A059] text-[10px] mt-4 text-center font-bold tracking-widest uppercase italic">{serverError}</p>}
            </div>
          </form>

          <div className="mt-8 text-center text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/30">
            <p>Already a member? <Link to="/login" className="text-[#C5A059] hover:text-[#F9F8F6]">Enter Nexus</Link></p>
          </div>
        </div>

        {/* Visual Side */}
        <div className="hidden md:block md:w-1/2 relative bg-[#151515] p-12 flex flex-col justify-between border-l border-white/5 text-right">
           <div>
             <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Molecular Enrollment
             </div>
             <h2 className="text-4xl font-bold tracking-tight text-[#F9F8F6] leading-[1.1]">
               Begin your <span className="text-[#C5A059] italic font-serif">Evolution.</span>
             </h2>
             <p className="mt-8 text-sm text-[#E5E0DA]/40 leading-relaxed font-light tracking-wide max-w-[280px] ml-auto">
               Decoding the biological signature of your skin for a high-fidelity scientific routine.
             </p>
           </div>
           
           <div className="mt-auto">
             <div className="flex items-center gap-3 justify-end text-[10px] font-bold tracking-[0.3em] uppercase opacity-20">
               <span>Dermatological Core Sync</span>
               <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></div>
             </div>
           </div>
        </div>
      </div>
    </div>

  );
};

export default Signup;
