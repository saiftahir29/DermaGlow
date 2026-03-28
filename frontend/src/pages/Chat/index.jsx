import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionMessages, sendChatMessage, generateReport } from "../../utils/api";
import { MessageCircle, FileText } from "lucide-react";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import { BeatLoader } from "react-spinners";

const Chat = () => {
  const location = useLocation();
  const { sessionId } = location.state;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        const sessionMessages = await getSessionMessages(sessionId);
        setMessages(sessionMessages);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [sessionId, location.state]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = { question: userInput, isUser: true };

    // Add user message immediately
    setMessages((prev) => [...prev, newMessage]);

    // Add loading message
    const loadingMessage = {
      answer: "...",
      isLoading: true,
      isUser: false,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    setUserInput("");
    scrollToBottom();

    try {
      const response = await sendChatMessage({ sessionId, message: userInput });

      // Replace loading message with actual response
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove loading message
        { answer: response.answer, isUser: false },
      ]);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      // Replace loading message with error
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { answer: "Sorry, there was an error processing your request." },
      ]);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const formattedResponse = await generateReport({ sessionId, messages });
      navigate("/report", { state: { report: formattedResponse } });
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#0D0D0D] text-[#F9F8F6] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header / Actions */}
      <div className="px-6 py-6 border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-md z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059]">Sync Active</span>
            <h2 className="text-sm font-semibold tracking-wide text-[#E5E0DA]">Neural Session</h2>
          </div>
          <button
            onClick={handleGenerateReport}
            className="px-6 py-2.5 bg-[#C5A059] text-[#0D0D0D] rounded-full hover:bg-[#F9F8F6] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.2)]"
            disabled={loading || isGeneratingReport}
          >
            <FileText size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">
              {isGeneratingReport ? "Encoding..." : "Generate Report"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative z-10">
        <div
          className="h-full px-4 md:px-10 py-10 overflow-y-auto"
          id="chat-messages"
        >
          <div className="max-w-4xl mx-auto space-y-10">
            {loading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <BeatLoader color="#C5A059" size={10} />
                  <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/20">Initializing Secure Link</span>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`flex flex-col ${message.isUser ? "items-end" : "items-start"} max-w-[85%]`}>
                    <div className="text-[9px] font-bold tracking-[0.3em] uppercase mb-2 opacity-30 px-2">
                       {message.isUser ? "Client" : "DermaCore AI"}
                    </div>
                    <div
                      className={`rounded-[24px] p-6 text-sm md:text-base leading-relaxed ${
                        message.isUser
                          ? "bg-[#C5A059] text-[#0D0D0D] font-semibold shadow-2xl rounded-tr-none"
                          : "bg-[#1A1A1A] text-[#F9F8F6]/90 border border-white/5 rounded-tl-none"
                      } transform transition-all duration-300 hover:scale-[1.01]`}
                    >
                      {message.isLoading ? (
                        <BeatLoader color="#C5A059" size={8} />
                      ) : message.question ? (
                        <div className="overflow-wrap-break-word word-break break-word tracking-wide">
                          {message.question}
                        </div>
                      ) : (
                        <MarkdownRenderer content={message.answer} />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-6 md:p-10 bg-[#0D0D0D] z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="relative group">
            <div className={`absolute inset-0 bg-[#C5A059]/20 rounded-2xl blur-xl opacity-0 transition-opacity duration-500 ${userInput.trim() ? "group-hover:opacity-100" : ""}`}></div>
            <div className="relative flex gap-4 items-center bg-[#1A1A1A] border border-white/10 rounded-2xl p-2 pl-6 focus-within:border-[#C5A059]/50 transition-all duration-300">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 bg-transparent py-3 text-sm border-none focus:outline-none focus:ring-0 text-[#F9F8F6] placeholder:text-white/20 tracking-wide font-light"
                placeholder="Query the AI..."
                disabled={loading}
              />
              <button
                type="submit"
                className="w-12 h-12 bg-[#C5A059] text-[#0D0D0D] rounded-xl flex items-center justify-center hover:bg-[#F9F8F6] transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed shadow-xl group-hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                disabled={loading || !userInput.trim()}
              >
                <MessageCircle size={20} className="transform group-active:scale-95 transition-transform" />
              </button>
            </div>
          </form>
          <div className="mt-4 flex justify-between items-center px-2">
             <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/10 italic">Core Session Active</div>
             <div className="text-[10px] font-mono text-white/5 uppercase">Secure Data Transmission Protocol v4.2</div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Chat;