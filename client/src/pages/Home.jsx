import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import FileUpload from "../components/FileUpload";
import JobDescription from "../components/JobDescription";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Home.css";

const Home = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const isFormValid =
    resumeFile !== null && jobDescription.trim().length >= 50;

  const handleAnalyze = async () => {
    if (!resumeFile) {
      toast.error("Please upload your resume first.");
      return;
    }
    if (jobDescription.trim().length < 50) {
      toast.error("Please enter a job description (min 50 characters).");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription.trim());

      const response = await axios.post("http://localhost:5000/api/analyze", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 60000,
      });

      if (response.data.success) {
        toast.success("Analysis complete!");
        navigate("/results", { state: { results: response.data.data } });
      } else {
        toast.error(response.data.error || "Analysis failed. Please try again.");
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error("Analysis error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page">
      {isLoading && <LoadingSpinner message="Analyzing your resume with AI..." />}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            AI-Powered Resume Analysis
          </div>
          <h1 className="hero-title">
            Beat the ATS &{" "}
            <span className="gradient-text">Land Your Dream Job</span>
          </h1>
          <p className="hero-subtitle">
            Upload your resume and paste the job description. Our AI analyzes
            keyword matches, calculates your ATS score, and gives you
            actionable suggestions to get past automated screening systems.
          </p>

          {/* Stats Row */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">ATS Accuracy</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-number">AI</span>
              <span className="stat-label">Gemini Powered</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-number">Free</span>
              <span className="stat-label">No Sign-up</span>
            </div>
          </div>
        </div>

        {/* Floating Cards Decoration */}
        <div className="hero-decoration">
          <div className="deco-card deco-card-1">
            <div className="deco-score">87</div>
            <div className="deco-label">ATS Score</div>
          </div>
          <div className="deco-card deco-card-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>12 Keywords Matched</span>
          </div>
          <div className="deco-card deco-card-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>AI Suggestions</span>
          </div>
        </div>
      </section>

      {/* Main Form */}
      <section className="form-section">
        <div className="form-container">
          {/* How it works */}
          <div className="how-it-works">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-info">
                <span className="step-title">Upload Resume</span>
                <span className="step-desc">PDF or DOCX</span>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-info">
                <span className="step-title">Paste Job Description</span>
                <span className="step-desc">From any job board</span>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-info">
                <span className="step-title">Get AI Analysis</span>
                <span className="step-desc">Score + suggestions</span>
              </div>
            </div>
          </div>

          {/* Upload & JD Grid */}
          <div className="form-grid">
            {/* Resume Upload */}
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div>
                  <h2 className="form-card-title">Upload Your Resume</h2>
                  <p className="form-card-subtitle">Supports PDF and DOCX formats</p>
                </div>
              </div>
              <FileUpload
                onFileSelect={setResumeFile}
                selectedFile={resumeFile}
              />
            </div>

            {/* Job Description */}
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div>
                  <h2 className="form-card-title">Job Description</h2>
                  <p className="form-card-subtitle">Paste the full job posting</p>
                </div>
              </div>
              <JobDescription
                value={jobDescription}
                onChange={setJobDescription}
              />
            </div>
          </div>

          {/* Analyze Button */}
          <div className="analyze-section">
            <button
              className={`btn btn-primary analyze-btn ${!isFormValid ? "disabled" : ""}`}
              onClick={handleAnalyze}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="btn-spinner"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  Analyze My Resume
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

            {!isFormValid && (
              <p className="analyze-hint">
                {!resumeFile
                  ? "⬆ Upload your resume to continue"
                  : "⬆ Add a job description (min 50 chars) to continue"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">What You'll Get</h2>
          <div className="features-grid">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                ),
                color: "#6366f1",
                title: "ATS Score",
                desc: "Get a 0-100 score showing how well your resume matches the job requirements.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                ),
                color: "#10b981",
                title: "Keyword Analysis",
                desc: "See exactly which keywords match and which ones are missing from your resume.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                ),
                color: "#f59e0b",
                title: "Skills Gap Analysis",
                desc: "Identify missing skills and understand what you need to add to your resume.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                ),
                color: "#06b6d4",
                title: "AI Suggestions",
                desc: "Get actionable, prioritized suggestions to improve your resume for this specific role.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                ),
                color: "#8b5cf6",
                title: "Section Analysis",
                desc: "Detailed scoring for each resume section: contact, summary, experience, education, skills.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
                color: "#ef4444",
                title: "Strengths Highlight",
                desc: "Discover what your resume does well and leverage those strengths in interviews.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                ),
                color: "#ec4899",
                title: "Interview Questions",
                desc: "Get personalized interview questions based on your resume and the job description.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                ),
                color: "#14b8a6",
                title: "Salary Insights",
                desc: "Get salary insights and compensation details based on your skills and experience.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                ),
                color: "#f97316",
                title: "Export PDF",
                desc: "Export your analysis results and improved resume to PDF for easy sharing.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div
                  className="feature-icon"
                  style={{
                    color: feature.color,
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
