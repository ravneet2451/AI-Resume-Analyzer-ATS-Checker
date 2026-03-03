const { extractTextFromFile } = require("../utils/fileParser");
const { analyzeResumeWithAI, generateInterviewQuestions, getSalaryInsights } = require("../utils/geminiAI");

/**
 * Main controller to handle resume analysis
 */
const analyzeResume = async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No resume file uploaded. Please upload a PDF or DOCX file.",
      });
    }

    // Validate job description
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error:
          "Job description is required and must be at least 50 characters long.",
      });
    }

    // Extract text from uploaded file
    console.log(`📄 Parsing file: ${req.file.originalname}`);
    const resumeText = await extractTextFromFile(
      req.file.buffer,
      req.file.originalname
    );

    if (resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        error:
          "Resume text is too short. Please upload a complete resume with sufficient content.",
      });
    }

    console.log(
      `✅ Text extracted successfully (${resumeText.length} characters)`
    );

    // Analyze with Gemini AI
    console.log("🤖 Sending to Gemini AI for analysis...");
    let analysisResult;
    let isDemo = false;
    
    try {
      analysisResult = await analyzeResumeWithAI(resumeText, jobDescription.trim(), false);
    } catch (apiError) {
      // If rate limited, fall back to demo mode
      if (apiError.message.includes("rate limit") || apiError.message.includes("quota")) {
        console.log("⚠️ API rate limit hit. Falling back to demo mode...");
        analysisResult = await analyzeResumeWithAI(resumeText, jobDescription.trim(), true);
        isDemo = true;
      } else {
        throw apiError;
      }
    }

    console.log(
      `✅ Analysis complete. ATS Score: ${analysisResult.atsScore}${isDemo ? " (Demo Mode)" : ""}`
    );

    return res.status(200).json({
      success: true,
      data: {
        ...analysisResult,
        resumeText,
        jobDescription: jobDescription.trim(),
        fileName: req.file.originalname,
        fileSize: req.file.size,
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Analysis error:", error.message);

    // Handle specific error types
    if (
      error.message.includes("API key") ||
      error.message.includes("unauthorized")
    ) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message.includes("rate limit") ||
      error.message.includes("quota")
    ) {
      return res.status(429).json({
        success: false,
        error: error.message,
      });
    }

    if (
      error.message.includes("parse") ||
      error.message.includes("extract")
    ) {
      return res.status(422).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred during analysis.",
    });
  }
};

/**
 * Generate interview questions based on resume and job description
 */
const generateInterviewCtrl = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: "Resume text and job description are required.",
      });
    }

    const questions = await generateInterviewQuestions(resumeText, jobDescription);
    
    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("❌ Interview questions error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate interview questions.",
    });
  }
};

/**
 * Get salary insights based on resume and job description
 */
const getSalaryInsightsCtrl = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: "Resume text and job description are required.",
      });
    }

    const insights = await getSalaryInsights(resumeText, jobDescription);
    
    return res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error("❌ Salary insights error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to get salary insights.",
    });
  }
};

/**
 * Health check controller
 */
const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Resume Analyzer API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
};

module.exports = { 
  analyzeResume, 
  healthCheck,
  generateInterviewCtrl,
  getSalaryInsightsCtrl
};
