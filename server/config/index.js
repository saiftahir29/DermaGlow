const devURLs = {
  BACKEND_URL: "http://localhost:8000",
  FRONTEND_URL: "http://localhost:5174",
  publicPics: "http://localhost:8000/uploads/publicPics",
};

const config = {
  ...( process.env.NODE_ENV === "production" ? prodURLs : devURLs ),
  secret: process.env.SECRET,
  port: process.env.PORT || 8000,
  dbURL: process.env.DB_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  smtpAuth: {
    SMTP_PORT: 587,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  },
  allowedOrigins: [ "http://localhost:5173", "http://localhost:5174" ],
  OPENAI_API_KEY: process.env.OPEN_AI_KEY,
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  WEATHERAPI_KEY: process.env.WEATHERAPI_KEY,

};

module.exports = config;
