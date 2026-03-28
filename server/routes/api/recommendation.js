const express = require("express");
const { auth } = require("../../middlewares");
const { ResponseHandler } = require("../../utils");
const { openai } = require("../../utils/openGpt");
const { getWeatherData } = require("../../utils/weather");

const router = express.Router();

/**
 * Builds AI prompt for weather-based skincare recommendations
 */
function buildWeatherPrompt(weather) {
  return `You are an AI skincare expert providing general skincare advice based on current weather conditions.

### Current Weather Conditions:
- **Location:** ${weather.city}, ${weather.country}
- **Temperature:** ${weather.temperature}°C (Feels like ${weather.feelsLike}°C)
- **Humidity:** ${weather.humidity}%
- **Condition:** ${weather.condition} (${weather.description})
- **Wind Speed:** ${weather.windSpeed} m/s

### Your Task:
Provide general skincare recommendations, precautions, and tips for men based on these weather conditions.

### Guidelines:
1. **Response Format**: Always respond in clean Markdown format with:
   - Headings (##, ###)
   - Bold text (**text**)
   - Bullet points (-)
   - Numbered lists when appropriate

2. **Content Structure**:
   - Start with a brief summary of weather impact on skin
   - Provide specific recommendations (cleansing, moisturizing, protection)
   - Include precautionary measures
   - Mention any product suggestions if relevant
   - Keep it concise but actionable (2-3 short paragraphs max)

3. **Focus Areas**:
   - Sun protection needs
   - Hydration requirements
   - Cleansing frequency
   - Product recommendations (general, not personalized)
   - Precautions to avoid

Remember: Format your response in clean Markdown. Keep it friendly, practical, and easy to read.`;
}

/**
 * GET /api/recommendation/weather
 * Get weather-based skincare recommendations
 * Query params: lat, lng
 */
router.get("/weather", auth.required, auth.user, async (req, res) => {
  try {
    const { lat, lng, city } = req.query;

    let weatherData;
    if (city) {
      weatherData = await getWeatherData(city);
    } else if (lat && lng) {
      weatherData = await getWeatherData(parseFloat(lat), parseFloat(lng));
    } else {
      return ResponseHandler.badRequest(res, "Provide either lat/lng or city");
    }

    // Generate AI recommendation
    const prompt = buildWeatherPrompt(weatherData);
    
    const aiResponse = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: "Provide skincare recommendations based on the weather conditions provided." },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const recommendation = aiResponse.choices[0].message.content;

    return ResponseHandler.ok(res, {
      weather: weatherData,
      recommendation,
    });
  } catch (error) {
    console.error("Error generating weather recommendation:", error);
    return ResponseHandler.badRequest(res, error.message || "Failed to generate recommendations");
  }
});

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { imageUploader } = require("../../utils/multer");

// ... existing code ...

/**
 * POST /api/recommendation/analyze-image
 * Upload an image and analyze it using the AI model
 */
router.post("/analyze-image", auth.required, auth.user, imageUploader.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return ResponseHandler.badRequest(res, "No image uploaded");
    }

    const imagePath = req.file.path;
    const scriptPath = path.join(process.cwd(), "predict.py");

    // Call python script
    exec(`python "${scriptPath}" "${imagePath}"`, (error, stdout, stderr) => {
      // Clean up uploaded file? Usually yes, but maybe keep for reference?
      // For now, let's keep it in public/uploads as per multer config

      if (error) {
        console.error("Exec error:", error);
        return ResponseHandler.badRequest(res, "AI Analysis failed: " + error.message);
      }

      try {
        const result = JSON.parse(stdout);
        if (result.status === "error") {
          return ResponseHandler.badRequest(res, result.message);
        }

        return ResponseHandler.ok(res, {
            detections: result.detections,
            summary: result.summary,
            imageUrl: `/uploads/${req.file.filename}`
        });
      } catch (parseError) {
        console.error("Parse error:", parseError, stdout);
        return ResponseHandler.badRequest(res, "Failed to parse AI results");
      }
    });
  } catch (error) {
    console.error("Error in analyze-image:", error);
    return ResponseHandler.badRequest(res, error.message || "Image analysis failed");
  }
});

module.exports = router;

