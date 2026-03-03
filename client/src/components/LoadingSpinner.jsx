import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ message = "Analyzing your resume..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        {/* Animated Brain/AI Icon */}
        <div className="loading-icon-wrapper">
          <div className="loading-ring ring-1"></div>
          <div className="loading-ring ring-2"></div>
          <div className="loading-ring ring-3"></div>
          <div className="loading-center-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill="url(#spinnerGrad)"
                opacity="0.2"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="url(#spinnerGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6v2M12 16v2M6 12H4M20 12h-2"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="spinnerGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Text */}
        <h3 className="loading-title">AI Analysis in Progress</h3>
        <p className="loading-message">{message}</p>

        {/* Steps */}
        <div className="loading-steps">
          <div className="loading-step active">
            <div className="step-dot"></div>
            <span>Parsing resume content</span>
          </div>
          <div className="loading-step">
            <div className="step-dot"></div>
            <span>Matching keywords</span>
          </div>
          <div className="loading-step">
            <div className="step-dot"></div>
            <span>Calculating ATS score</span>
          </div>
          <div className="loading-step">
            <div className="step-dot"></div>
            <span>Generating suggestions</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="loading-progress-bar">
          <div className="loading-progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
