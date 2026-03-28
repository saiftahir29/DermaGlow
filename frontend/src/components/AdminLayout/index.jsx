import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, Building2, User, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  const onLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A2AA7B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5C6748]">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { icon: Building2, label: 'Clinics', path: '/admin/clinics', active: location.pathname.startsWith('/admin/clinics') },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex selection:bg-[#C5A059] selection:text-[#0D0D0D]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-24'} bg-[#151515] border-r border-white/5 transition-all duration-500 flex flex-col relative z-30`}>
        {/* Logo Section */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-4">
                <img src="/src/assets/derma_glow_final.png" alt="Logo" className="h-8 object-contain" />
                <div>
                  <h1 className="text-xs font-bold text-[#F9F8F6] tracking-[0.2em] uppercase">Control</h1>
                  <p className="text-[9px] text-[#C5A059]/60 font-medium tracking-[0.3em] uppercase">Level 01 Matrix</p>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                 <img src="/src/assets/derma_glow_final.png" alt="Logo" className="h-6 object-contain" />
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-[#E5E0DA]/20 hover:text-[#C5A059] transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex justify-center p-3 text-[#E5E0DA]/20 hover:text-[#C5A059] transition-colors mb-6"
            >
              <Menu size={20} />
            </button>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 overflow-hidden relative group ${
                  item.active
                    ? 'bg-white/5 text-[#C5A059] border border-[#C5A059]/20'
                    : 'text-[#E5E0DA]/40 hover:text-[#F9F8F6] hover:bg-white/2'
                }`}
              >
                {item.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C5A059] rounded-r-full shadow-[0_0_15px_rgba(197,160,89,0.5)]"></div>
                )}
                <Icon size={18} className={`${item.active ? 'text-[#C5A059]' : 'text-current'} transition-colors`} />
                {sidebarOpen && <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-white/5 space-y-6">
          <div className={`flex items-center gap-4 p-4 rounded-3xl bg-white/2 border border-white/5 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-[#C5A059] rounded-2xl flex items-center justify-center shadow-[0_5px_15px_rgba(197,160,89,0.3)]">
              <User className="text-[#0D0D0D]" size={18} />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#F9F8F6] uppercase tracking-wider truncate">{user.fullName || 'Admin'}</p>
                <p className="text-[9px] text-[#C5A059]/60 uppercase tracking-widest mt-1">Prime Director</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogOut}
            className={`w-full flex items-center gap-4 px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-[#F9F8F6]/60 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-[#0D0D0D] rounded-2xl transition-all duration-500 ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Terminate Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Decor */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <header className="bg-transparent border-b border-white/5 px-10 py-8 backdrop-blur-md relative z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 text-[#C5A059] text-[9px] font-bold tracking-[0.4em] uppercase mb-2">
                 <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-pulse"></span>
                 System Active
              </div>
              <h2 className="text-2xl font-bold text-[#F9F8F6] uppercase tracking-tighter">
                {location.pathname.startsWith('/admin/clinics') ? 'Node Registry' : 'Neural Command'}
              </h2>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="hidden md:block text-right">
                  <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase italic">Integrity: 100% Verified</p>
               </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-10 relative z-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
