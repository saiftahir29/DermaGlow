import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { successToaster, failureToaster } from "../../utils/swal";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    // Password should be at least 6 characters, contain a number, uppercase letter, and special character
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("Password must be at least 6 characters long, include a number, an uppercase letter, and a special character.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (passwordData.confirmPassword !== passwordData.newPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPasswordValid = validatePassword(passwordData.newPassword);
    const isConfirmPasswordValid = validateConfirmPassword();

    if (isPasswordValid && isConfirmPasswordValid) {
      setLoading(true);

      try {
        const response = await axios.post(
          `http://localhost:8000/api/auth/reset-password/${token}`,
          { password: passwordData.newPassword }
        );
  
        console.log("Response received:", response);
        successToaster("Password reset successfully! Redirecting...");
        
        setTimeout(() => navigate("/login"), 1000);
      } catch (error) {
        console.error("Request error:", error);
        failureToaster(error.response?.data?.message || "Something went wrong.");
        setErrors({ apiError: error.response?.data?.message || "Something went wrong." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-full bg-[#0D0D0D] flex items-center justify-center p-4 relative overflow-y-auto selection:bg-[#C5A059] selection:text-[#0D0D0D]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg bg-[#1A1A1A] border border-white/5 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] p-8 md:p-12 my-10">
        {/* Header */}
        <div className="mb-10 text-center">
           <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
                Security Protocol
           </div>
           <h2 className="text-2xl font-bold tracking-tight text-[#F9F8F6] uppercase">
             Registry Update
           </h2>
           <p className="mt-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#E5E0DA]/40">
             Define new secure authentication keys
           </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-3 ml-2">New Secure Key</label>
              <div className="relative group">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  onBlur={() => validatePassword(passwordData.newPassword)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/10 font-light text-sm pr-14"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#F9F8F6]/20 hover:text-[#C5A059] transition-colors"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="text-[#C5A059] text-[10px] mt-3 ml-2 font-bold tracking-tighter italic lowercase leading-tight">{passwordError}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-3 ml-2">Verify Key</label>
              <div className="relative group">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  onBlur={validateConfirmPassword}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/10 font-light text-sm pr-14"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#F9F8F6]/20 hover:text-[#C5A059] transition-colors"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPasswordError && <p className="text-[#C5A059] text-[10px] mt-3 ml-2 font-bold tracking-tighter italic lowercase">{confirmPasswordError}</p>}
            </div>
          </div>

          {/* API Error */}
          {errors.apiError && (
            <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] px-6 py-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase text-center italic">
              {errors.apiError}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 flex flex-col gap-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-full text-xs font-bold tracking-[0.3em] uppercase text-[#0D0D0D] bg-[#C5A059] hover:bg-[#F9F8F6] transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)]"
              >
                {loading ? "Updating..." : "Authorize Reset"}
              </button>

              <div className="text-center">
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/20">
                  Abort protocol? <Link to="/login" className="text-[#C5A059] hover:text-[#F9F8F6]">Enter Nexus</Link>
                </p>
              </div>
            </div>
        </form>
      </div>
    </div>

  );
};

export default ResetPassword;