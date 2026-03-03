const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { analyzeResume, healthCheck, generateInterviewCtrl, getSalaryInsightsCtrl } = require("../controllers/analyzeController");
const auth = require("../middleware/auth");

// Health check route (public)
router.get("/health", healthCheck);

// Resume analysis route (protected - requires authentication)
router.post("/analyze", auth, upload.single("resume"), analyzeResume);

// Generate interview questions (protected)
router.post("/interview-questions", auth, generateInterviewCtrl);

// Get salary insights (protected)
router.post("/salary-insights", auth, getSalaryInsightsCtrl);

// Handle multer errors
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File size too large. Maximum allowed size is 5MB.",
    });
  }
  if (err.message && err.message.includes("Only PDF and DOCX")) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next(err);
});

module.exports = router;
