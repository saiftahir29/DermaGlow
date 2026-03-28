import { useState, useEffect } from "react";
import { getWeatherRecommendation } from "../utils/api";
import { useLocation } from "./useLocation";


export const useWeatherRecommendation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { location, getLocation } = useLocation();

  const fetchRecommendation = async () => {
    // Check if already fetched today
    const today = new Date().toDateString();
    const lastFetch = localStorage.getItem("weatherRecLastFetch");
    const cachedData = localStorage.getItem("weatherRecData");

    if (lastFetch === today && cachedData) {
      try {
        setData(JSON.parse(cachedData));
        return;
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }

    if (!location) {
      getLocation();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getWeatherRecommendation({
        lat: location.lat,
        lng: location.lng,
      });

      // Cache for today
      localStorage.setItem("weatherRecLastFetch", today);
      localStorage.setItem("weatherRecData", JSON.stringify(result));
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch recommendations");
      // Avoid repeated attempts today on error
      localStorage.setItem("weatherModalLastShown", today);
      console.error("Weather recommendation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location && !data && !loading) {
      fetchRecommendation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return {
    data,
    loading,
    error,
    fetchRecommendation,
    requestLocation: getLocation,
  };
};

