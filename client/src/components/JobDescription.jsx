import React, { useState } from "react";
import "./JobDescription.css";

const JobDescription = ({ value, onChange }) => {
  const [charCount, setCharCount] = useState(value?.length || 0);
  const MIN_CHARS = 50;
  const MAX_CHARS = 5000;

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setCharCount(text.length);
      onChange(text);
    }
  };

  const handlePaste = (e) => {
    // Allow paste but enforce max length
    setTimeout(() => {
      const text = e.target.value.slice(0, MAX_CHARS);
      setCharCount(text.length);
      onChange(text);
    }, 0);
  };

  const clearText = () => {
    onChange("");
    setCharCount(0);
  };

  const isValid = charCount >= MIN_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.9;

  return (
    <div className="jd-wrapper">
      {/* Header */}
      <div className="jd-header">
        <div className="jd-title-row">
          <div className="jd-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <span className="jd-label">Job Description</span>
          {isValid && (
            <span className="jd-valid-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Valid
            </span>
          )}
        </div>
        {value && (
          <button className="jd-clear-btn" onClick={clearText} title="Clear">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Textarea */}
      <div className={`jd-textarea-wrapper ${isValid ? "valid" : ""} ${charCount > 0 && !isValid ? "invalid" : ""}`}>
        <textarea
          className="jd-textarea"
          placeholder="Paste the job description here...

Example:
We are looking for a Senior React Developer with 3+ years of experience in JavaScript, React.js, Node.js, and REST APIs. The ideal candidate should have experience with TypeScript, Redux, and cloud platforms like AWS or Azure..."
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          rows={10}
          spellCheck={false}
        />
      </div>

      {/* Footer */}
      <div className="jd-footer">
        <div className="jd-hint">
          {charCount === 0 && (
            <span className="hint-text">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Minimum {MIN_CHARS} characters required
            </span>
          )}
          {charCount > 0 && !isValid && (
            <span className="hint-text warning">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {MIN_CHARS - charCount} more characters needed
            </span>
          )}
          {isValid && (
            <span className="hint-text success">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Job description looks good!
            </span>
          )}
        </div>
        <span className={`char-count ${isNearLimit ? "near-limit" : ""}`}>
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>

      {/* Tips */}
      <div className="jd-tips">
        <p className="tips-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Tips for better results:
        </p>
        <ul className="tips-list">
          <li>Include the full job description with requirements</li>
          <li>Include required skills, qualifications & responsibilities</li>
          <li>More detail = more accurate ATS score</li>
        </ul>
      </div>
    </div>
  );
};

export default JobDescription;
