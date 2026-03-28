import MarkdownRenderer from "../../components/MarkdownRenderer";
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import html2pdf from "html2pdf.js";
import { BeatLoader } from "react-spinners";

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Get report data from location state
  const { report, sessionId } = location.state || { report: null, sessionId: null };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAF5]">
        <div className="text-xl font-medium mb-4">No report data available</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#A2AA7B] text-white rounded-lg hover:bg-sage-700 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }


  const handleDownloadPDF = async () => {
    setIsExporting(true);
    const element = reportRef.current;
    
    try {
      // Create a clone of the report content for PDF export
      // This removes height restrictions that could cause content truncation
      const clonedElement = element.cloneNode(true);
      const container = document.createElement('div');
      container.appendChild(clonedElement);
      
      // Remove any height/overflow restrictions from the cloned element
      clonedElement.style.maxHeight = 'none';
      clonedElement.style.height = 'auto';
      clonedElement.style.overflow = 'visible';
      
      // Find any scrollable containers in the clone and remove their restrictions
      const scrollableElements = clonedElement.querySelectorAll('[class*="overflow-y-auto"], [class*="overflow-auto"]');
      scrollableElements.forEach(el => {
        el.style.maxHeight = 'none';
        el.style.height = 'auto';
        el.style.overflow = 'visible';
      });

      const opt = {
        margin: [15, 15],
        filename: "skincare-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          scrollY: 0,
          // Ensure complete content capture
          logging: true,
          letterRendering: true,
          windowHeight: Math.max(
            document.body.scrollHeight, 
            document.body.offsetHeight, 
            document.documentElement.clientHeight, 
            document.documentElement.scrollHeight, 
            document.documentElement.offsetHeight
          )
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      await html2pdf().from(clonedElement).set(opt).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsExporting(false);
    }
  };


  const handleBackToChat = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-full bg-[#0D0D0D] text-[#F9F8F6] py-12 px-4 relative">
      {/* Dynamic Background decor */}
      <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header actions */}
      <div className="max-w-4xl mx-auto mb-10 relative z-10 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <button
            onClick={handleBackToChat}
            className="group flex items-center gap-2 text-[#E5E0DA]/40 hover:text-[#C5A059] transition-all"
          >
            <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Return to Session</span>
          </button>
          
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 md:flex-initial flex items-center justify-center gap-3 px-8 py-3 bg-[#C5A059] text-[#0D0D0D] rounded-full hover:bg-[#F9F8F6] transition-all duration-300 disabled:opacity-30 shadow-[0_10px_20px_rgba(197,160,89,0.2)]"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <BeatLoader color="#0D0D0D" size={8} />
                  <span className="text-xs font-bold tracking-widest uppercase">Encoding...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span className="text-xs font-bold tracking-widest uppercase">Export PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mb-12 relative z-10">
        <div className="mb-6">
           <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-4 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase">
              High-Fidelity Output
           </div>
           <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F9F8F6]">
             Clinical <span className="text-[#C5A059] italic font-serif">Report.</span>
           </h1>
        </div>

        <div 
          ref={reportRef}
          className="bg-[#1A1A1A] border border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] rounded-[32px] w-full overflow-hidden print:bg-white print:text-black print:shadow-none print:rounded-none pdf-container p-1"
        >
          {/* Main content with modern scrollbar */}
          <div className="p-6 md:p-12">
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={report} />
            </div>
          </div>
          
          {/* Internal Footer for PDF */}
          <div className="px-12 py-6 bg-white/5 border-t border-white/5 flex justify-between items-center print:hidden">
             <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20">Derma Core v2.0</div>
             <div className="text-[10px] font-mono text-white/10 uppercase italic">Confidential Biological Data</div>
          </div>
        </div>
      </div>
      
      {/* Global Footer - hidden when printing */}
      <div className="max-w-4xl mx-auto mt-12 text-center print:hidden">
        <p className="text-[9px] tracking-[0.5em] uppercase text-white/10">
          Sync Date: {new Date().toLocaleDateString()} | Verified by AI Integrity Core
        </p>
      </div>
    </div>

  );
};

export default Report;