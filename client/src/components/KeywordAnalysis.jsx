import React, { useState } from "react";
import "./KeywordAnalysis.css";

const KeywordAnalysis = ({ data }) => {
  const [activeTab, setActiveTab] = useState("matched");

  const matchedKeywords = data?.matchedKeywords || [];
  const missingKeywords = data?.missingKeywords || [];
  const presentSkills = data?.skillsAnalysis?.presentSkills || [];
  const missingSkills = data?.skillsAnalysis?.missingSkills || [];
  const skillMatchPct = data?.skillsAnalysis?.skillMatchPercentage || 0;

  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const matchRate =
    totalKeywords > 0
      ? Math.round((matchedKeywords.length / totalKeywords) * 100)
      : 0;

  const tabs = [
    {
      id: "matched",
      label: "Matched",
      count: matchedKeywords.length,
      color: "success",
    },
    {
      id: "missing",
      label: "Missing",
      count: missingKeywords.length,
      color: "danger",
    },
    {
      id: "skills",
      label: "Skills",
      count: presentSkills.length + missingSkills.length,
      color: "primary",
    },
  ];

  return (
    <div className="keyword-wrapper animate-fade-in">
      {/* Header Stats */}
      <div className="keyword-stats">
        <div className="kw-stat-item">
          <div className="kw-stat-circle success">
            <span>{matchedKeywords.length}</span>
          </div>
          <div className="kw-stat-info">
            <span className="kw-stat-label">Matched Keywords</span>
            <span className="kw-stat-sub">Found in resume</span>
          </div>
        </div>

        <div className="kw-stat-divider">
          <div className="match-rate-bar">
            <div
              className="match-rate-fill"
              style={{ width: `${matchRate}%` }}
            ></div>
          </div>
          <span className="match-rate-text">{matchRate}% match rate</span>
        </div>

        <div className="kw-stat-item">
          <div className="kw-stat-circle danger">
            <span>{missingKeywords.length}</span>
          </div>
          <div className="kw-stat-info">
            <span className="kw-stat-label">Missing Keywords</span>
            <span className="kw-stat-sub">Not in resume</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="kw-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`kw-tab ${activeTab === tab.id ? "active" : ""} tab-${tab.color}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className={`kw-tab-count count-${tab.color}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="kw-content">
        {/* Matched Keywords */}
        {activeTab === "matched" && (
          <div className="kw-panel animate-fade-in">
            {matchedKeywords.length > 0 ? (
              <>
                <p className="kw-panel-desc">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  These keywords from the job description were found in your resume.
                </p>
                <div className="kw-tags">
                  {matchedKeywords.map((kw, idx) => (
                    <span key={idx} className="kw-tag kw-tag-success">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {kw}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="kw-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <p>No matched keywords found</p>
              </div>
            )}
          </div>
        )}

        {/* Missing Keywords */}
        {activeTab === "missing" && (
          <div className="kw-panel animate-fade-in">
            {missingKeywords.length > 0 ? (
              <>
                <p className="kw-panel-desc warning">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Add these keywords to your resume to improve your ATS score.
                </p>
                <div className="kw-tags">
                  {missingKeywords.map((kw, idx) => (
                    <span key={idx} className="kw-tag kw-tag-danger">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      {kw}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="kw-empty success">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>Great! No missing keywords found.</p>
              </div>
            )}
          </div>
        )}

        {/* Skills Analysis */}
        {activeTab === "skills" && (
          <div className="kw-panel animate-fade-in">
            {/* Skill Match Progress */}
            <div className="skill-match-header">
              <span className="skill-match-label">Overall Skill Match</span>
              <span className="skill-match-pct">{skillMatchPct}%</span>
            </div>
            <div className="skill-match-bar">
              <div
                className="skill-match-fill"
                style={{ width: `${skillMatchPct}%` }}
              ></div>
            </div>

            <div className="skills-grid">
              {/* Present Skills */}
              <div className="skills-column">
                <h4 className="skills-col-title success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Skills You Have ({presentSkills.length})
                </h4>
                <div className="kw-tags">
                  {presentSkills.length > 0 ? (
                    presentSkills.map((skill, idx) => (
                      <span key={idx} className="kw-tag kw-tag-success">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="no-skills">No skills detected</p>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="skills-column">
                <h4 className="skills-col-title danger">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Skills to Add ({missingSkills.length})
                </h4>
                <div className="kw-tags">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((skill, idx) => (
                      <span key={idx} className="kw-tag kw-tag-danger">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="no-skills success-text">All required skills present!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordAnalysis;
