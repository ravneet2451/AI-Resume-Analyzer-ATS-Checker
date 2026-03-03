import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ATSScore from "../components/ATSScore";
import KeywordAnalysis from "../components/KeywordAnalysis";
import Suggestions from "../components/Suggestions";
import InterviewQuestions from "../components/InterviewQuestions";
import SalaryInsights from "../components/SalaryInsights";
import ExportPDF from "../components/ExportPDF";
import "./Results.css";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("score");

  const results = location.state?.results;

  // Redirect if no results
  if (!results) {
    return (
      <div className="results-empty">
        <div className="empty-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h2>No Results Found</h2>
          <p>Please analyze a resume first to see results here.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go to Analyzer
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "score",
      label: "ATS Score",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
    },
    {
      id: "keywords",
      label: "Keywords",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
    },
    {
      id: "suggestions",
      label: "Suggestions",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
      badge: results?.suggestions?.length,
    },
    {
      id: "interview",
      label: "Interview",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
    },
    {
      id: "salary",
      label: "Salary",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
    },
    {
      id: "export",
      label: "Export PDF",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      ),
    },
  ];

  const getScoreColor = (s) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#f59e0b";
    if (s >= 40) return "#f97316";
    return "#ef4444";
  };

  const scoreColor = getScoreColor(results.atsScore);

  return (
    <div className="results-page">
      {/* Results Header */}
      <div className="results-header">
        <div className="results-header-inner">
          {/* Back Button */}
          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Analyze Another
          </button>

          {/* File Info */}
          <div className="results-file-info">
            <div className="results-file-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <p className="results-file-name">{results.fileName}</p>
              <p className="results-file-meta">
                Analyzed {new Date(results.analyzedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Score Badge */}
          <div
            className="results-score-badge"
            style={{
              color: scoreColor,
              background: `${scoreColor}15`,
              borderColor: `${scoreColor}40`,
            }}
          >
            <span className="results-score-num">{results.atsScore}</span>
            <span className="results-score-label">ATS Score</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="results-tabs-wrapper">
        <div className="results-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`results-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
              {tab.badge > 0 && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="results-content">
        <div className="results-content-inner">
          {activeTab === "score" && <ATSScore data={results} />}
          {activeTab === "keywords" && <KeywordAnalysis data={results} />}
          {activeTab === "suggestions" && <Suggestions data={results} />}
          {activeTab === "interview" && (
            <InterviewQuestions 
              resumeText={results.resumeText} 
              jobDescription={results.jobDescription} 
            />
          )}
          {activeTab === "salary" && (
            <SalaryInsights 
              resumeText={results.resumeText} 
              jobDescription={results.jobDescription} 
            />
          )}
          {activeTab === "export" && <ExportPDF analysisData={results} />}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="results-footer">
        <div className="results-footer-inner">
          <p className="footer-text">
            Want to improve your score? Update your resume based on the suggestions above and analyze again.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
            </svg>
            Analyze Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
