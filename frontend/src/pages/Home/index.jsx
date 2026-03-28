import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessageCircle, FileText, Shield, Sparkles, ChevronRight, Star, Check, Droplet, Zap, Activity } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (token && userInfo) {
      setUser(JSON.parse(userInfo)); // Set user if logged in
    } else {
      setUser(null); // Set user to null if not logged in
    }

    window.addEventListener("scroll", handleScroll);

    // Scroll to hash if present
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F9F8F6] font-sans selection:bg-[#C5A059] selection:text-[#0D0D0D]">

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0D0D0D]/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="/src/assets/derma_glow_final.png"
              alt="Derma-Glow"
              className="h-14 object-contain"
            />
          </div>
          
          <div className="hidden md:flex items-center gap-12">
            <a href="#features" className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#F9F8F6]/40 hover:text-[#C5A059] transition-colors">Features</a>
            <a href="#how-it-works" className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#F9F8F6]/40 hover:text-[#C5A059] transition-colors">Science</a>
            
            {user ? (
              <button
                onClick={() => navigate("/assessment")}
                className="px-8 py-3 bg-[#C5A059] text-[#0D0D0D] rounded-full text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#F9F8F6] transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)]"
              >
                Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                className="px-8 py-3 bg-[#C5A059] text-[#0D0D0D] rounded-full text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#F9F8F6] transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)]"
              >
                Access
              </Link>
            )}
          </div>
        </div>
      </nav>



      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#C5A059]/3 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto flex flex-col lg:flex-row items-center relative z-10">
          <div className="lg:w-1/2 mb-16 lg:mb-0">
            <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-xs font-semibold tracking-widest uppercase">
              Scientific Purity & AI Precision
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#F9F8F6] leading-[1.1] mb-8">
              Purity for your <span className="text-[#C5A059] italic font-serif">Aura.</span>
            </h1>
            <p className="text-xl text-[#E5E0DA]/80 max-w-xl leading-relaxed font-light mb-12">
              Experience a new era of skincare where deep scientific insights meet clinical AI precision. Tailored to the unique chemistry of your skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => navigate(user ? "/assessment" : "/signup")}
                className="px-8 py-4 bg-[#F9F8F6] text-[#0D0D0D] font-bold rounded-full hover:bg-[#C5A059] transition-all shadow-2xl flex items-center justify-center group"
              >
                Get Started
                <ChevronRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#methodology"
                className="px-8 py-4 border border-[#F9F8F6]/20 bg-white/5 backdrop-blur-sm text-[#F9F8F6] font-medium rounded-full hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
              >
                Our Methodology
              </a>
            </div>
            <div className="mt-12 flex items-center gap-8 text-xs text-[#E5E0DA]/50 uppercase tracking-widest font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full shadow-[0_0_8px_#C5A059]"></div>
                <span>Free Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full shadow-[0_0_8px_#C5A059]"></div>
                <span>Dermatology AI</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 lg:pl-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#C5A059]/20 rounded-[30px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 bg-[#1A1A1A] rounded-[30px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5 p-1">
                <div className="p-4 bg-[#232323] rounded-t-[29px] border-b border-white/5 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-white/10 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-white/10 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Glow System v2.0</div>
                  <div className="w-10"></div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-start">
                    <div className="bg-[#2D2D2D] border border-white/5 rounded-2xl rounded-tl-none p-5 text-[#F9F8F6]/90 text-sm leading-relaxed max-w-[85%]">
                      Welcome. Let's analyze your skin's molecular needs. What's your primary goal?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#C5A059] rounded-2xl rounded-tr-none p-5 text-[#0D0D0D] text-sm font-semibold max-w-[85%] shadow-xl">
                      I need to balance deep hydration with a radiant, scientific finish.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-[#2D2D2D] border border-white/5 rounded-2xl rounded-tl-none p-5 text-[#C5A059] text-sm leading-relaxed max-w-[85%] font-medium">
                      Initializing Molecular Routine... Creating high-contrast hydration plan.
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 text-[9px] text-center text-white/20 tracking-widest uppercase">
                  Encrypted Aesthetic Data Syncing...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-32 bg-[#0D0D0D] relative border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-[#F9F8F6] mb-4">Scientific Benchmarks</h2>
            <div className="w-20 h-1 bg-[#C5A059]"></div>
            <p className="mt-8 text-[#E5E0DA]/60 max-w-xl text-lg font-light">
              We've deconstructed skincare to its fundamental elements, providing a higher standard of personalization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group p-8 rounded-[20px] bg-[#1A1A1A] border border-white/5 hover:border-[#C5A059]/30 transition-all duration-500">
              <div className="w-12 h-12 bg-[#2D2D2D] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#C5A059] transition-colors duration-500">
                <MessageCircle size={20} className="text-[#C5A059] group-hover:text-[#0D0D0D]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F9F8F6] mb-4">Neural Analysis</h3>
              <p className="text-[#E5E0DA]/50 leading-relaxed font-light">
                Our AI utilizes neural networks trained on clinical data to decode your skin's unique genetic and environmental markers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-[20px] bg-[#1A1A1A] border border-white/5 hover:border-[#C5A059]/30 transition-all duration-500">
              <div className="w-12 h-12 bg-[#2D2D2D] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#C5A059] transition-colors duration-500">
                <FileText size={20} className="text-[#C5A059] group-hover:text-[#0D0D0D]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F9F8F6] mb-4">Molecular Reports</h3>
              <p className="text-[#E5E0DA]/50 leading-relaxed font-light">
                Receive high-fidelity reports detailing every active ingredient recommended for your skin, backed by scientific rationale.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-[20px] bg-[#1A1A1A] border border-white/5 hover:border-[#C5A059]/30 transition-all duration-500">
              <div className="w-12 h-12 bg-[#2D2D2D] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#C5A059] transition-colors duration-500">
                <Shield size={20} className="text-[#C5A059] group-hover:text-[#0D0D0D]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F9F8F6] mb-4">Clinical Integrity</h3>
              <p className="text-[#E5E0DA]/50 leading-relaxed font-light">
                Experience evidence-based guidance that prioritizes your skin's health and integrity above all else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-32 bg-[#0D0D0D] relative border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/10 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[10px] font-bold tracking-[0.4em] uppercase">
                  Our Methodology
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F9F8F6] mb-8 leading-tight">
                The Science of <br />
                <span className="text-[#C5A059] italic font-serif">Aura Extraction.</span>
              </h2>
              <p className="text-lg text-[#E5E0DA]/60 leading-relaxed font-light mb-12">
                Our proprietary methodology combines high-depth dermal imaging with neural synthesis to create a hyper-personalized skin architectural protocol. 
              </p>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A059] transition-all duration-500">
                    <Droplet className="text-[#C5A059] group-hover:text-[#0D0D0D]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#F9F8F6] mb-2 uppercase tracking-wider">01. Dermal Digitization</h4>
                    <p className="text-sm text-[#E5E0DA]/40 font-light leading-relaxed">Through our <strong>AI Senses Scan</strong>, we convert physical skin parameters—texture, hydration levels, and anomalies—into high-fidelity biological data points from simple photos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A059] transition-all duration-500">
                    <Zap className="text-[#C5A059] group-hover:text-[#0D0D0D]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#F9F8F6] mb-2 uppercase tracking-wider">02. Neural Synthesis</h4>
                    <p className="text-sm text-[#E5E0DA]/40 font-light leading-relaxed">Our AI engine processes these data points through a matrix of clinical research to identify the most effective molecular interactions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A059] transition-all duration-500">
                    <Activity className="text-[#C5A059] group-hover:text-[#0D0D0D]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#F9F8F6] mb-2 uppercase tracking-wider">03. Molecular Optimization</h4>
                    <p className="text-sm text-[#E5E0DA]/40 font-light leading-relaxed">A final customized protocol is generated, recommending specific ingredients and concentrations for your unique skin chemistry.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
               <div className="absolute inset-0 bg-[#C5A059]/10 blur-[100px] rounded-full"></div>
               <div className="relative border border-white/5 bg-[#1A1A1A] p-12 rounded-[40px] shadow-2xl">
                  <div className="flex justify-between items-center mb-12">
                     <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/20">Analysis Matrix</span>
                     <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     {[85, 92, 78, 95].map((val, i) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-[#E5E0DA]/40">
                             <span>Parameter {i+1}</span>
                             <span>{val}%</span>
                          </div>
                          <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                             <div 
                               className="h-full bg-[#C5A059] transition-all duration-1000" 
                               style={{ width: `${val}%`, transitionDelay: `${i*200}ms` }}
                             ></div>
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="mt-12 pt-12 border-t border-white/5">
                     <p className="text-[10px] text-center font-bold tracking-[0.5em] uppercase text-[#C5A059] animate-pulse">Neural Synchronization Active</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-32 bg-[#0D0D0D] border-t border-white/5 relative overflow-hidden">
        {/* Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A059]/3 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-6 text-[#C5A059] text-[10px] font-bold tracking-[0.4em] uppercase">
                The Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#F9F8F6] uppercase tracking-tight">How It Works</h2>
            <p className="mt-6 text-[#E5E0DA]/40 max-w-xl mx-auto text-sm font-light leading-relaxed">
              Our clinical workflow is designed to achieve maximum skin optimization through three distinct phases of analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-[#1A1A1A] p-10 rounded-[32px] border border-white/5 group-hover:border-[#C5A059]/30 transition-all duration-500 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#2D2D2D] border border-white/10 rounded-2xl flex items-center justify-center text-[#C5A059] font-bold text-xl mb-8 group-hover:bg-[#C5A059] group-hover:text-[#0D0D0D] transition-all">01</div>
                <h3 className="text-xl font-bold text-[#F9F8F6] mb-4 uppercase tracking-wider">Assessment</h3>
                <p className="text-[#E5E0DA]/50 font-light leading-relaxed">Provide your bio-profile data through our encrypted diagnostic interface for initial screening.</p>
              </div>
              <div className="hidden md:block absolute top-[28px] left-[calc(100%-20px)] w-24 h-[1px] bg-gradient-to-r from-[#C5A059]/30 to-transparent z-0"></div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-[#1A1A1A] p-10 rounded-[32px] border border-white/5 group-hover:border-[#C5A059]/30 transition-all duration-500 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#2D2D2D] border border-white/10 rounded-2xl flex items-center justify-center text-[#C5A059] font-bold text-xl mb-8 group-hover:bg-[#C5A059] group-hover:text-[#0D0D0D] transition-all">02</div>
                <h3 className="text-xl font-bold text-[#F9F8F6] mb-4 uppercase tracking-wider">Neural Sync</h3>
                <p className="text-[#E5E0DA]/50 font-light leading-relaxed">Engage with our Neural AI to refine the data points and analyze specific molecular concerns.</p>
              </div>
              <div className="hidden md:block absolute top-[28px] left-[calc(100%-20px)] w-24 h-[1px] bg-gradient-to-r from-[#C5A059]/30 to-transparent z-0"></div>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="bg-[#1A1A1A] p-10 rounded-[32px] border border-white/5 group-hover:border-[#C5A059]/30 transition-all duration-500 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#2D2D2D] border border-white/10 rounded-2xl flex items-center justify-center text-[#C5A059] font-bold text-xl mb-8 group-hover:bg-[#C5A059] group-hover:text-[#0D0D0D] transition-all">03</div>
                <h3 className="text-xl font-bold text-[#F9F8F6] mb-4 uppercase tracking-wider">Protocol</h3>
                <p className="text-[#E5E0DA]/50 font-light leading-relaxed">Receive your high-fidelity report and clinical protocol for daily skin architectural maintenance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#1A1A1A] text-[#F9F8F6] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-50%] right-[-10%] w-[1000px] h-[1000px] bg-[#C5A059] rounded-full blur-[150px]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Elevate Your Presence.</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-[#E5E0DA]/70 font-light leading-relaxed">
            Begin your transformation with our AI. A scientific approach to the ultimate skin clarity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => navigate("/signup")}
              className="px-12 py-5 bg-[#C5A059] text-[#0D0D0D] font-bold rounded-full hover:bg-white transition-all shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)] text-lg"
            >
              Consult the AI
            </button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-[#0D0D0D] py-20 border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="max-w-xs">
              <img
                src="/src/assets/derma_glow_final.png"
                alt="Derma-Glow"
                className="h-14 object-contain mb-8"
              />
              <p className="text-[#E5E0DA]/40 text-sm font-light leading-relaxed">
                Scientific skincare precision through neural analysis. Deciphering your skin's unique molecular protocol.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex space-x-8 text-xs font-bold tracking-[0.3em] uppercase opacity-60">
                <a href="#" className="hover:text-[#C5A059] transition-colors">Instagram</a>
                <a href="#" className="hover:text-[#C5A059] transition-colors">Twitter</a>
                <a href="#" className="hover:text-[#C5A059] transition-colors">Lab Notes</a>
              </div>
              <p className="text-[10px] opacity-20 tracking-widest font-mono">
                ©2026 DERMA-GLOW. ALL SYSTEMS OPERATIONAL.
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
