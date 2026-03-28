import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Camera, Upload, X, Check, Loader2, Sparkles } from 'lucide-react';
import { startSession } from "../../utils/api";
import { addSession } from '../../store/sessionSlice';
import apiClient from "../../utils/api";

const SkinAssessment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Existing Form Data
  const [ formData, setFormData ] = useState( {
    skinType: '',
    mainConcern: '',
    specificSkinIssues: [],
    workEnvironment: '',
    stressLevel: '',
    sleepQuality: '',
    exerciseFrequency: '',
    dietType: '',
    sunscreenUsage: '',
    sunExposure: '',
    climateType: '',
    currentRoutine: '',
    productUsageFrequency: '',
    skincareBudget: '',
    waterIntake: '',
    alcoholConsumption: '',
    smokingStatus: '',
    additionalSkinConcerns: '',
    skinTextureDescription: ''
  } );

  // NEW: Image Upload & AI Analysis State
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleRadioChange = ( e ) => {
    const { name, value } = e.target;
    setFormData( prev => ( { ...prev, [ name ]: value } ) );
  };

  const handleCheckboxChange = ( e ) => {
    const { value, checked } = e.target;
    setFormData( prev => ( {
      ...prev,
      specificSkinIssues: checked
        ? [ ...prev.specificSkinIssues, value ]
        : prev.specificSkinIssues.filter( item => item !== value )
    } ) );
  };

  const handleInputChange = ( e ) => {
    const { name, value } = e.target;
    setFormData( prev => ( { ...prev, [ name ]: value } ) );
  };

  // NEW: Image Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setAnalysisResult(null); // Reset result on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    const uploadData = new FormData();
    uploadData.append("image", selectedImage);

    try {
      const { data } = await apiClient.post("/recommendation/analyze-image", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (data.success) {
        setAnalysisResult(data.data);
        // Automatically add detected issues to form data
        const detectedIssues = Object.keys(data.data.summary);
        setFormData(prev => ({
            ...prev,
            specificSkinIssues: Array.from(new Set([...prev.specificSkinIssues, ...detectedIssues])),
            additionalSkinConcerns: prev.additionalSkinConcerns + "\n" + `AI Analysis detected: ${detectedIssues.join(", ")}`
        }));
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitAssessment = async ( e ) => {
    e.preventDefault();
    try {
      const session = await startSession(formData);
      dispatch( addSession( session ) );
      navigate( `/chat/${session.id}`, {
        state: { sessionId: session.id }
      } );
    } catch ( error ) {
      console.error( "Error saving session:", error );
    }
  };
  
  return (
    <div className="min-h-full bg-[#0D0D0D] text-[#F9F8F6] flex items-center justify-center px-4 relative py-10">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#C5A059]/3 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 bg-[#1A1A1A] border border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] rounded-[32px] p-10">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-4 text-[#C5A059] text-[10px] font-bold tracking-[0.2em] uppercase">
            Molecular Decoding
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F9F8F6]">Skin Assessment</h1>
          <p className="text-sm text-[#E5E0DA]/40 mt-2 font-light tracking-wide italic">Analyzing your unique biological aura</p>
        </div>

        <form className="space-y-12" onSubmit={submitAssessment}>
          
          {/* NEW: AI IMAGE SCAN SECTION */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059]">00. AI Senses Scan</h2>
              <div className="flex-grow h-px bg-white/5"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40">
                  Visual Dermal Analysis
                </label>
                <div 
                    className={`relative aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden ${
                        imagePreview ? 'border-[#C5A059]/50 bg-black' : 'border-white/10 bg-white/5 hover:border-[#C5A059]/30'
                    }`}
                >
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                            <button 
                                type="button"
                                onClick={() => { setImagePreview(null); setSelectedImage(null); setAnalysisResult(null); }}
                                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500/50 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </>
                    ) : (
                        <div className="text-center p-6">
                            <Camera className="mx-auto text-[#C5A059] mb-4 opacity-50" size={40} />
                            <p className="text-xs font-light text-[#E5E0DA]/40">Tap to upload a clear face photo</p>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    )}
                </div>
                
                {selectedImage && !analysisResult && (
                    <button
                        type="button"
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="w-full py-4 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-[#C5A059] hover:text-[#0D0D0D] transition-all flex items-center justify-center gap-3"
                    >
                        {isAnalyzing ? <><Loader2 className="animate-spin" size={16} /> Deciphering Aura...</> : <><Sparkles size={16} /> Analyze with AI</>}
                    </button>
                )}
              </div>

              <div className="bg-black/20 rounded-2xl p-6 border border-white/5 min-h-[150px]">
                {analysisResult ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#C5A059]">Detection Results</h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(analysisResult.summary).length > 0 ? (
                                Object.entries(analysisResult.summary).map(([label, count]) => (
                                    <div key={label} className="px-3 py-1 bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] rounded-full text-[10px] font-bold uppercase flex items-center gap-2">
                                        <Check size={10} /> {label} ({count})
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-[#E5E0DA]/40 italic">No specific anomalies detected. Skin appears optimal.</p>
                            )}
                        </div>
                        <p className="text-[10px] text-[#E5E0DA]/30 font-light mt-4">
                            Detections have been automatically added to the assessment profile below.
                        </p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-30">
                        <Sparkles size={32} className="mb-4" />
                        <p className="text-xs font-light">AI Insights will appear here after analysis</p>
                    </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059]">01. Skin Profile</h2>
              <div className="flex-grow h-px bg-white/5"></div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4">
                Primary Surface Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[ 'Oily', 'Dry', 'Combination', 'Normal' ].map( type => (
                  <label
                    key={type}
                    className={`px-4 py-3 text-sm text-center border rounded-full cursor-pointer transition-all duration-300 ${formData.skinType === type
                      ? 'bg-[#F9F8F6] text-[#0D0D0D] border-[#F9F8F6] font-bold shadow-[0_0_20px_rgba(249,248,246,0.3)]'
                      : 'border-white/10 text-[#E5E0DA]/60 hover:border-[#C5A059]/50 hover:text-[#C5A059]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="skinType"
                      value={type}
                      checked={formData.skinType === type}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {type}
                  </label>
                ) )}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4">
                Cellular Concerns
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[ 'Aging', 'Acne', 'Uneven Tone', 'Sensitivity', 'Oiliness' ].map( concern => (
                  <label
                    key={concern}
                    className={`px-4 py-3 text-sm text-center border rounded-full cursor-pointer transition-all duration-300 ${formData.mainConcern === concern
                      ? 'bg-[#C5A059] text-[#0D0D0D] border-[#C5A059] font-bold shadow-[0_0_20px_rgba(197,160,89,0.3)]'
                      : 'border-white/10 text-[#E5E0DA]/60 hover:border-[#C5A059]/50 hover:text-[#C5A059]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="mainConcern"
                      value={concern}
                      checked={formData.mainConcern === concern}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {concern}
                  </label>
                ) )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4">
                Target Anomalies
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[ 'Blackheads', 'Whiteheads', 'Dark Circles', 'Fine Lines', 'Irritation', 'Acne', 'Pigmentation', 'Spots', 'Wrinkle' ].map( issue => (
                  <label
                    key={issue}
                    className={`px-4 py-3 text-sm flex items-center justify-center border rounded-full cursor-pointer transition-all duration-300 ${formData.specificSkinIssues.includes( issue )
                      ? 'bg-white/10 text-[#C5A059] border-[#C5A059]'
                      : 'border-white/10 text-[#E5E0DA]/60 hover:border-white/20'
                      }`}
                  >
                    <input
                      type="checkbox"
                      value={issue}
                      checked={formData.specificSkinIssues.includes( issue )}
                      onChange={handleCheckboxChange}
                      className="mr-3 accent-[#C5A059]"
                    />
                    {issue}
                  </label>
                ) )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059]">02. Environmental Exposure</h2>
              <div className="flex-grow h-px bg-white/5"></div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4">
                UV Filtration Frequency
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[ 'Daily', 'Most Days', 'Occasionally', 'Rarely/Never' ].map( usage => (
                  <label
                    key={usage}
                    className={`px-4 py-3 text-sm text-center border rounded-full cursor-pointer transition-all duration-300 ${formData.sunscreenUsage === usage
                      ? 'bg-white text-[#0D0D0D] font-bold border-white'
                      : 'border-white/10 text-[#E5E0DA]/60 hover:border-white/20'
                      }`}
                  >
                    <input
                      type="radio"
                      name="sunscreenUsage"
                      value={usage}
                      checked={formData.sunscreenUsage === usage}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {usage}
                  </label>
                ) )}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4">
                Ambient Environment
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[ 'Indoor', 'Outdoor', 'Mixed' ].map( env => (
                  <label
                    key={env}
                    className={`px-4 py-3 text-sm text-center border rounded-full cursor-pointer transition-all duration-300 ${formData.workEnvironment === env
                      ? 'bg-white text-[#0D0D0D] font-bold border-white'
                      : 'border-white/10 text-[#E5E0DA]/60 hover:border-white/20'
                      }`}
                  >
                    <input
                      type="radio"
                      name="workEnvironment"
                      value={env}
                      checked={formData.workEnvironment === env}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {env}
                  </label>
                ) )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059]">03. Supplementary Data</h2>
              <div className="flex-grow h-px bg-white/5"></div>
            </div>
            
            <label htmlFor="additionalSkinConcerns" className="block text-[10px] font-bold tracking-widest uppercase text-[#F9F8F6]/40 mb-4">
              Detailed Observations
            </label>
            <textarea
              id="additionalSkinConcerns"
              name="additionalSkinConcerns"
              rows={3}
              value={formData.additionalSkinConcerns}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[#F9F8F6] focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-[#E5E0DA]/20 font-light"
              placeholder="Provide any additional molecular or textural details..."
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-[#C5A059] text-[#0D0D0D] py-5 rounded-full text-sm font-bold tracking-[0.3em] uppercase hover:bg-[#F9F8F6] transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(197,160,89,0.2)] group"
            >
              Analyze & Generate Solutions
            </button>
            <p className="text-center text-[9px] text-white/10 mt-6 tracking-[0.4em] uppercase font-mono italic">
              AI Core Processing Active • Integrity Verified • Molecular Bio-Data Sync Complete
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkinAssessment;

