import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './SideBar';
import { useWeatherRecommendation } from '../../hooks/useWeatherRecommendation';
import WeatherRecommendationModal from '../WeatherRecommendationModal';

const Layout = () => {
  const { data, requestLocation } = useWeatherRecommendation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user has seen modal today
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem("weatherModalLastShown");
    
    // Only request location if modal hasn't been shown today
    if (lastShown !== today && navigator.geolocation) {
      requestLocation();
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Show modal when data is ready (once per day)
    if (data && !showModal) {
      const today = new Date().toDateString();
      const lastShown = localStorage.getItem("weatherModalLastShown");
      
      if (lastShown !== today) {
        setShowModal(true);
        localStorage.setItem("weatherModalLastShown", today);
      }
    }
  }, [data, showModal]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0D0D0D]">
      <div className='flex-shrink-0'>
        <Sidebar />
      </div>
      <div className="flex-grow flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>


      {/* Weather Recommendation Modal */}
      <WeatherRecommendationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={data}
      />
    </div>
  );
};

export default Layout;