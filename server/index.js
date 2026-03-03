require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const path = require("path");
const analyzeRoutes = require("./routes/analyze");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api", analyzeRoutes);

// ─── Root Route ───────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🚀 AI Resume Analyzer & ATS Checker API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      analyze: "POST /api/analyze",
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      getMe: "GET /api/auth/me",
    },
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   AI Resume Analyzer & ATS Checker     ║");
  console.log("╠════════════════════════════════════════╣");
  console.log(`║  Server running on port ${PORT}           ║`);
  console.log(`║  API: http://localhost:${PORT}/api        ║`);
  console.log("╚════════════════════════════════════════╝");

  if (
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY === "your_gemini_api_key_here"
  ) {
    console.warn(
      "⚠️  WARNING: Gemini API key not configured. Add it to server/.env"
    );
  } else {
    console.log("✅ Gemini API key configured");
  }
});

module.exports = app;
