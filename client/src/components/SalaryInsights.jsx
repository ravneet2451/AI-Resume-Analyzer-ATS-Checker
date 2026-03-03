import { useState } from "react";
import axios from "axios";
import "./SalaryInsights.css";

const SalaryInsights = ({ resumeText, jobDescription }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      // Public endpoint - no auth required
      const response = await axios.post(
        "http://localhost:5000/api/salary-insights",
        { resumeText, jobDescription }
      );
      if (response.data.success) {
        setInsights(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salary-insights">
      <div className="section-header">
        <h3>💰 Salary Insights</h3>
        <button onClick={fetchInsights} disabled={loading} className="generate-btn">
          {loading ? "Loading..." : "Get Insights"}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {insights && (
        <div className="insights-content">
          <div className="salary-range">
            <div className="range-label">Estimated Salary Range</div>
            <div className="range-value">
              ${insights.estimatedRange?.min?.toLocaleString()} - ${insights.estimatedRange?.max?.toLocaleString()} {insights.estimatedRange?.currency}
            </div>
          </div>
          
          <div className="factors-section">
            <h4>Key Factors</h4>
            {insights.factors?.map((factor, i) => (
              <div key={i} className={`factor-item ${factor.impact}`}>
                <span className="factor-text">{factor.factor}</span>
                <span className={`factor-impact ${factor.impact}`}>{factor.impact}</span>
              </div>
            ))}
          </div>
          
          <div className="trends-section">
            <h4>📈 Market Trends</h4>
            <ul>
              {insights.marketTrends?.map((trend, i) => (
                <li key={i}>{trend}</li>
              ))}
            </ul>
          </div>
          
          <div className="skills-impact">
            <h4>🔥 Skills Impact</h4>
            <div className="skills-grid">
              {insights.skillsImpact?.map((skill, i) => (
                <span key={i} className={`skill-tag ${skill.value}`}>
                  {skill.skill} ({skill.value})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryInsights;
