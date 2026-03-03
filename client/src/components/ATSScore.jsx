import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./ATSScore.css";

const ATSScore = ({ data }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  const score = data?.atsScore || 0;
  const skillMatch = data?.skillsAnalysis?.skillMatchPercentage || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (s) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#f59e0b";
    if (s >= 40) return "#f97316";
    return "#ef4444";
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return { label: "Excellent", desc: "Your resume is highly optimized for ATS" };
    if (s >= 60) return { label: "Good", desc: "Your resume passes most ATS filters" };
    if (s >= 40) return { label: "Fair", desc: "Your resume needs some improvements" };
    return { label: "Poor", desc: "Your resume needs significant optimization" };
  };

  const scoreColor = getScoreColor(score);
  const { label, desc } = getScoreLabel(score);

  const sectionScores = data?.sectionAnalysis
    ? Object.entries(data.sectionAnalysis).map(([key, val]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        score: val.score,
        feedback: val.feedback,
      }))
    : [];

  return (
    <div className="ats-score-wrapper animate-fade-in">
      {/* Main Score Card */}
      <div className="score-main-card">
        <div className="score-left">
          <div className="score-circle-wrapper">
            <CircularProgressbar
              value={animatedScore}
              text={`${animatedScore}`}
              styles={buildStyles({
                textSize: "22px",
                pathColor: scoreColor,
                textColor: scoreColor,
                trailColor: "rgba(255,255,255,0.05)",
                pathTransitionDuration: 1.5,
              })}
            />
            <div className="score-label-below">ATS Score</div>
          </div>
        </div>

        <div className="score-right">
          <div className="score-badge" style={{ color: scoreColor, borderColor: scoreColor, background: `${scoreColor}15` }}>
            {label} Match
          </div>
          <p className="score-desc">{desc}</p>

          <div className="score-meta">
            <div className="meta-item">
              <span className="meta-label">Keywords Matched</span>
              <span className="meta-value success">
                {data?.matchedKeywords?.length || 0}
              </span>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <span className="meta-label">Missing Keywords</span>
              <span className="meta-value danger">
                {data?.missingKeywords?.length || 0}
              </span>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <span className="meta-label">Skill Match</span>
              <span className="meta-value" style={{ color: getScoreColor(skillMatch) }}>
                {skillMatch}%
              </span>
            </div>
          </div>

          {/* Overall Assessment */}
          {data?.overallAssessment && (
            <div className="overall-assessment">
              <p className="assessment-text">"{data.overallAssessment}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Section Scores */}
      {sectionScores.length > 0 && (
        <div className="section-scores">
          <h3 className="section-scores-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Section Analysis
          </h3>
          <div className="section-scores-grid">
            {sectionScores.map((section, idx) => (
              <div key={idx} className="section-score-item">
                <div className="section-score-header">
                  <span className="section-name">{section.name}</span>
                  <span
                    className="section-score-value"
                    style={{ color: getScoreColor(section.score) }}
                  >
                    {section.score}/100
                  </span>
                </div>
                <div className="section-progress-bar">
                  <div
                    className="section-progress-fill"
                    style={{
                      width: `${section.score}%`,
                      background: getScoreColor(section.score),
                    }}
                  ></div>
                </div>
                {section.feedback && (
                  <p className="section-feedback">{section.feedback}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {data?.strengthsHighlights?.length > 0 && (
        <div className="strengths-card">
          <h3 className="strengths-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Your Strengths
          </h3>
          <div className="strengths-list">
            {data.strengthsHighlights.map((strength, idx) => (
              <div key={idx} className="strength-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScore;
