const axios = require("axios");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

/**
 * Analyze resume against job description using Google Gemini AI
 */
const analyzeResumeWithAI = async (resumeText, jobDescription, isDemoMode = false) => {
  // Demo mode for testing without API calls
  if (isDemoMode) {
    return getDemoAnalysis(resumeText, jobDescription);
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    // Auto-enable demo mode if no API key
    console.log("⚠️ No API key found. Using demo mode.");
    return getDemoAnalysis(resumeText, jobDescription);
  }

  const prompt = buildAnalysisPrompt(resumeText, jobDescription);

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty response received from Gemini API.");
    }

    return parseAIResponse(rawText);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || "Unknown API error";
      // If 403 (invalid key), fall back to demo mode instead of throwing error
      if (status === 403) {
        console.log("⚠️ Invalid API key. Falling back to demo mode.");
        return getDemoAnalysis(resumeText, jobDescription);
      }
      if (status === 400) throw new Error(`Invalid API request: ${message}`);
      if (status === 429) throw new Error("API rate limit exceeded. Please try again later.");
      throw new Error(`Gemini API error (${status}): ${message}`);
    }
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    }
    // For other errors, fall back to demo mode
    console.log(`⚠️ API error: ${error.message}. Falling back to demo mode.`);
    return getDemoAnalysis(resumeText, jobDescription);
  }
};

/**
 * Build the analysis prompt for Gemini
 */
const buildAnalysisPrompt = (resumeText, jobDescription) => {
  return `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze the following resume against the job description and provide a detailed, structured analysis.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide your analysis in the following EXACT JSON format (no markdown, no code blocks, just pure JSON):
{
  "atsScore": <number between 0-100>,
  "overallAssessment": "<2-3 sentence overall assessment>",
  "matchedKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "skillsAnalysis": {
    "presentSkills": ["skill1", "skill2", ...],
    "missingSkills": ["skill1", "skill2", ...],
    "skillMatchPercentage": <number between 0-100>
  },
  "sectionAnalysis": {
    "contactInfo": { "score": <number 0-100>, "feedback": "<feedback text>" },
    "summary": { "score": <number 0-100>, "feedback": "<feedback text>" },
    "experience": { "score": <number 0-100>, "feedback": "<feedback text>" },
    "education": { "score": <number 0-100>, "feedback": "<feedback text>" },
    "skills": { "score": <number 0-100>, "feedback": "<feedback text>" }
  },
  "suggestions": [
    { "priority": "high", "category": "<category>", "suggestion": "<suggestion>" },
    { "priority": "medium", "category": "<category>", "suggestion": "<suggestion>" }
  ],
  "formattingTips": ["tip1", "tip2"],
  "strengthsHighlights": ["strength1", "strength2"]
}

Rules:
- atsScore should reflect how well the resume matches the job description for ATS systems
- matchedKeywords: keywords from the job description found in the resume
- missingKeywords: important keywords from the job description NOT found in the resume
- suggestions should have at least 5 items
- Return ONLY valid JSON, no extra text`;
};

/**
 * Parse and validate the AI response
 */
const parseAIResponse = (rawText) => {
  try {
    let cleanText = rawText.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
    const parsed = JSON.parse(cleanText);
    const required = ["atsScore", "overallAssessment", "matchedKeywords", "missingKeywords", "skillsAnalysis", "sectionAnalysis", "suggestions"];
    for (const field of required) {
      if (parsed[field] === undefined) throw new Error(`Missing required field: ${field}`);
    }
    parsed.atsScore = Math.min(100, Math.max(0, Number(parsed.atsScore)));
    parsed.skillsAnalysis.skillMatchPercentage = Math.min(100, Math.max(0, Number(parsed.skillsAnalysis.skillMatchPercentage)));
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
};

/**
 * Generate interview questions based on resume and job description
 */
const generateInterviewQuestions = async (resumeText, jobDescription) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") return getDemoInterviewQuestions();

  const prompt = `Based on the following resume and job description, generate relevant interview questions.

RESUME: ${resumeText}
JOB DESCRIPTION: ${jobDescription}

Provide your response in EXACT JSON format:
{
  "technicalQuestions": [{ "question": "<question>", "focus": "<skill>" }],
  "behavioralQuestions": [{ "question": "<question>", "focus": "<skill>" }],
  "situationalQuestions": [{ "question": "<question>", "focus": "<skill>" }]
}
Return ONLY valid JSON.`;

  try {
    const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }, { headers: { "Content-Type": "application/json" }, timeout: 30000 });
    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty response");
    return parseQuestionsResponse(rawText);
  } catch (error) {
    console.error("Interview questions error:", error.message);
    return getDemoInterviewQuestions();
  }
};

const parseQuestionsResponse = (rawText) => {
  try {
    let cleanText = rawText.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
    return JSON.parse(cleanText);
  } catch { return getDemoInterviewQuestions(); }
};

const getDemoInterviewQuestions = () => ({
  technicalQuestions: [
    { question: "Explain the difference between var, let, and const in JavaScript.", focus: "JavaScript Fundamentals" },
    { question: "How does React's virtual DOM work?", focus: "React" },
    { question: "What is the purpose of async/await in JavaScript?", focus: "Asynchronous Programming" },
  ],
  behavioralQuestions: [
    { question: "Tell me about a time you had to meet a tight deadline.", focus: "Time Management" },
    { question: "Describe a situation where you had to work with a difficult team member.", focus: "Teamwork" },
  ],
  situationalQuestions: [
    { question: "How would you handle a project scope change mid-sprint?", focus: "Problem Solving" },
  ],
});

/**
 * Get salary insights based on resume and job description
 */
const getSalaryInsights = async (resumeText, jobDescription) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") return getDemoSalaryInsights();

  const prompt = `Based on the following resume and job description, provide salary insights.

RESUME: ${resumeText}
JOB DESCRIPTION: ${jobDescription}

Provide your response in EXACT JSON format:
{
  "estimatedRange": { "min": <number>, "max": <number>, "currency": "USD" },
  "factors": [{ "factor": "<factor>", "impact": "positive/negative/neutral" }],
  "marketTrends": ["<trend>"],
  "skillsImpact": [{ "skill": "<skill>", "value": "high/medium/low" }]
}
Return ONLY valid JSON.`;

  try {
    const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
    }, { headers: { "Content-Type": "application/json" }, timeout: 30000 });
    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty response");
    return parseSalaryResponse(rawText);
  } catch (error) {
    console.error("Salary insights error:", error.message);
    return getDemoSalaryInsights();
  }
};

const parseSalaryResponse = (rawText) => {
  try {
    let cleanText = rawText.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
    return JSON.parse(cleanText);
  } catch { return getDemoSalaryInsights(); }
};

const getDemoSalaryInsights = () => ({
  estimatedRange: { min: 75000, max: 120000, currency: "USD" },
  factors: [
    { factor: "Years of Experience", impact: "positive" },
    { factor: "Technical Skills", impact: "positive" },
    { factor: "Education", impact: "neutral" },
    { factor: "Location", impact: "positive" },
  ],
  marketTrends: [
    "Demand for full-stack developers remains high",
    "Remote work options are increasingly common",
    "Cloud skills are premium valued",
  ],
  skillsImpact: [
    { skill: "React", value: "high" },
    { skill: "Node.js", value: "high" },
    { skill: "AWS", value: "medium" },
    { skill: "TypeScript", value: "medium" },
  ],
});

/**
 * Demo mode - returns sample analysis results
 */
const getDemoAnalysis = (resumeText, jobDescription) => {
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();
  const commonKeywords = ["javascript", "react", "node", "python", "java", "sql", "html", "css", "typescript", "angular", "vue", "mongodb", "mysql", "postgresql", "aws", "docker", "kubernetes", "git", "rest", "api", "agile", "scrum"];
  const matchedKeywords = commonKeywords.filter(kw => jdLower.includes(kw) && resumeLower.includes(kw));
  const missingKeywords = commonKeywords.filter(kw => jdLower.includes(kw) && !resumeLower.includes(kw)).slice(0, 8);

  return {
    atsScore: Math.floor(Math.random() * 30) + 65,
    overallAssessment: "Your resume shows good potential but could be optimized for ATS systems.",
    matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords : ["JavaScript", "React", "Node.js"],
    missingKeywords: missingKeywords.length > 0 ? missingKeywords : ["TypeScript", "REST API", "Agile"],
    skillsAnalysis: {
      presentSkills: matchedKeywords.length > 0 ? matchedKeywords : ["JavaScript", "React", "Node.js"],
      missingSkills: missingKeywords.length > 0 ? missingKeywords : ["TypeScript", "REST API"],
      skillMatchPercentage: Math.floor(Math.random() * 40) + 50
    },
    sectionAnalysis: {
      contactInfo: { score: 90, feedback: "Contact information is complete." },
      summary: { score: 75, feedback: "Consider adding a professional summary." },
      experience: { score: 80, feedback: "Experience section looks good." },
      education: { score: 85, feedback: "Education section is well-formatted." },
      skills: { score: 70, feedback: "Add more relevant technical skills." }
    },
    suggestions: [
      { priority: "high", category: "Keywords", suggestion: "Add more keywords from the job description." },
      { priority: "high", category: "Quantification", suggestion: "Add measurable achievements to experience." },
      { priority: "medium", category: "Summary", suggestion: "Include a professional summary." },
      { priority: "medium", category: "Skills", suggestion: "Create a dedicated skills section." },
      { priority: "low", category: "Formatting", suggestion: "Ensure consistent formatting." }
    ],
    formattingTips: ["Use standard section headings", "Keep resume to 1-2 pages", "Use clean font like Arial"],
    strengthsHighlights: ["Good structure", "Clear work experience", "Professional formatting"],
    isDemo: true
  };
};

module.exports = { analyzeResumeWithAI, generateInterviewQuestions, getSalaryInsights };
