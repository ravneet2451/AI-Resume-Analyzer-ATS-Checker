import { useState } from "react";
import axios from "axios";
import "./InterviewQuestions.css";

const InterviewQuestions = ({ resumeText, jobDescription }) => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Public endpoint - no auth required
      const response = await axios.post(
        "http://localhost:5000/api/interview-questions",
        { resumeText, jobDescription }
      );
      if (response.data.success) {
        setQuestions(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-questions">
      <div className="section-header">
        <h3>🎯 Interview Questions</h3>
        <button onClick={generateQuestions} disabled={loading} className="generate-btn">
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {questions && (
        <div className="questions-content">
          <div className="question-category">
            <h4>Technical Questions</h4>
            {questions.technicalQuestions?.map((q, i) => (
              <div key={i} className="question-item">
                <span className="question-text">❓ {q.question}</span>
                <span className="question-focus">Focus: {q.focus}</span>
              </div>
            ))}
          </div>
          
          <div className="question-category">
            <h4>Behavioral Questions</h4>
            {questions.behavioralQuestions?.map((q, i) => (
              <div key={i} className="question-item">
                <span className="question-text">❓ {q.question}</span>
                <span className="question-focus">Focus: {q.focus}</span>
              </div>
            ))}
          </div>
          
          <div className="question-category">
            <h4>Situational Questions</h4>
            {questions.situationalQuestions?.map((q, i) => (
              <div key={i} className="question-item">
                <span className="question-text">❓ {q.question}</span>
                <span className="question-focus">Focus: {q.focus}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewQuestions;
