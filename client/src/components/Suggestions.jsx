import React, { useState } from "react";
import "./Suggestions.css";

const priorityConfig = {
  high: {
    label: "High Priority",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.25)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  medium: {
    label: "Medium Priority",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.25)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  low: {
    label: "Low Priority",
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.1)",
    border: "rgba(99, 102, 241, 0.25)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 8 12 12 14 14"/>
      </svg>
    ),
  },
};

const Suggestions = ({ data }) => {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const suggestions = data?.suggestions || [];
  const formattingTips = data?.formattingTips || [];

  const filteredSuggestions =
    filter === "all"
      ? suggestions
      : suggestions.filter((s) => s.priority === filter);

  const counts = {
    all: suggestions.length,
    high: suggestions.filter((s) => s.priority === "high").length,
    medium: suggestions.filter((s) => s.priority === "medium").length,
    low: suggestions.filter((s) => s.priority === "low").length,
  };

  const toggleExpand = (idx) => {
    setExpanded(expanded === idx ? null : idx);
  };

  return (
    <div className="suggestions-wrapper animate-fade-in">
      {/* Filter Buttons */}
      <div className="suggestions-filters">
        {["all", "high", "medium", "low"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""} filter-${f}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : priorityConfig[f]?.label || f}
            <span className="filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="suggestions-list">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion, idx) => {
            const config = priorityConfig[suggestion.priority] || priorityConfig.low;
            const isExpanded = expanded === idx;

            return (
              <div
                key={idx}
                className={`suggestion-item ${isExpanded ? "expanded" : ""}`}
                style={{
                  borderColor: isExpanded ? config.color : undefined,
                }}
                onClick={() => toggleExpand(idx)}
              >
                <div className="suggestion-header">
                  <div className="suggestion-left">
                    <div
                      className="suggestion-priority-icon"
                      style={{ color: config.color, background: config.bg }}
                    >
                      {config.icon}
                    </div>
                    <div className="suggestion-meta">
                      <span
                        className="suggestion-priority-badge"
                        style={{
                          color: config.color,
                          background: config.bg,
                          borderColor: config.border,
                        }}
                      >
                        {config.label}
                      </span>
                      {suggestion.category && (
                        <span className="suggestion-category">
                          {suggestion.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="suggestion-expand-icon" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                <div className={`suggestion-body ${isExpanded ? "show" : ""}`}>
                  <p className="suggestion-text">{suggestion.suggestion}</p>
                </div>

                {!isExpanded && (
                  <p className="suggestion-preview">
                    {suggestion.suggestion?.slice(0, 100)}
                    {suggestion.suggestion?.length > 100 ? "..." : ""}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="suggestions-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p>No suggestions for this filter</p>
          </div>
        )}
      </div>

      {/* Formatting Tips */}
      {formattingTips.length > 0 && (
        <div className="formatting-tips">
          <h3 className="tips-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Formatting Tips
          </h3>
          <div className="tips-grid">
            {formattingTips.map((tip, idx) => (
              <div key={idx} className="tip-item">
                <div className="tip-number">{idx + 1}</div>
                <p className="tip-text">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
