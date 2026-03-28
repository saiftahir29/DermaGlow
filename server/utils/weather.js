const axios = require("axios");

/**
 * Fetches current weather using WeatherAPI.com (with API key)
 * Accepts either (lat, lng) numbers OR a single string query like "Gujrat" or "auto:ip"
 */
async function getWeatherData(a, b) {
  try {
    const key = process.env.WEATHERAPI_KEY || require("../config").WEATHERAPI_KEY;
    if (!key) throw new Error("WEATHERAPI_KEY not configured");

    let q;
    if (typeof a === "string") {
      q = a; // city or auto:ip
    } else if (typeof a === "number" && typeof b === "number") {
      q = `${a},${b}`; // lat,lng
    } else {
      throw new Error("Invalid coordinates or query");
    }

    // Include AQI for completeness; current contains uv, condition, wind, humidity, temp
    const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(q)}&aqi=yes`;
    const { data } = await axios.get(url);

    return {
      temperature: Math.round(data.current?.temp_c ?? 0),
      feelsLike: Math.round(data.current?.feelslike_c ?? 0),
      humidity: data.current?.humidity ?? null,
      uvIndex: data.current?.uv ?? null,
      condition: data.current?.condition?.text || "Unknown",
      description: data.current?.condition?.text || "",
      windSpeed: data.current?.wind_kph ? Number((data.current.wind_kph / 3.6).toFixed(1)) : 0, // kph -> m/s
      city: data.location?.name || "",
      country: data.location?.country || "",
    };
  } catch (error) {
    console.error("Error fetching weather (WeatherAPI):", error?.response?.data || error.message);
    throw new Error("Failed to fetch weather data");
  }
}

module.exports = { getWeatherData };

