import { useState } from "react";
import "./ExportPDF.css";

const ExportPDF = ({ analysisData }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    
    if (!analysisData) {
      setExporting(false);
      alert("No content to export");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setExporting(false);
      alert("Please allow popups to export PDF");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume Analysis Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
          .header h1 { color: #667eea; margin-bottom: 10px; }
          .score-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
          .score { font-size: 4rem; font-weight: bold; }
          .score-label { font-size: 1.2rem; opacity: 0.9; }
          .section { margin-bottom: 25px; }
          .section h2 { color: #667eea; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
          .keywords { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
          .keyword { padding: 4px 12px; border-radius: 15px; font-size: 0.85rem; }
          .matched { background: #dcfce7; color: #166534; }
          .missing { background: #fee2e2; color: #991b1b; }
          .suggestions { list-style: none; }
          .suggestions li { padding: 12px; margin-bottom: 8px; border-radius: 8px; background: #f8f9fa; }
          .priority-high { border-left: 4px solid #ef4444; }
          .priority-medium { border-left: 4px solid #f59e0b; }
          .priority-low { border-left: 4px solid #22c55e; }
          .strengths { display: flex; flex-wrap: wrap; gap: 8px; }
          .strength { background: #dbeafe; color: #1e40af; padding: 6px 14px; border-radius: 20px; }
          .tips { display: flex; flex-wrap: wrap; gap: 8px; }
          .tip { background: #fef3c7; color: #92400e; padding: 6px 14px; border-radius: 20px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 0.85rem; border-top: 1px solid #eee; padding-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📄 Resume Analysis Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="score-section">
          <div class="score">${analysisData?.atsScore || 0}</div>
          <div class="score-label">ATS Compatibility Score</div>
        </div>
        
        <div class="section">
          <h2>Overall Assessment</h2>
          <p>${analysisData?.overallAssessment || "N/A"}</p>
        </div>
        
        <div class="section">
          <h2>Matched Keywords</h2>
          <div class="keywords">
            ${(analysisData?.matchedKeywords || []).map(k => `<span class="keyword matched">${k}</span>`).join("")}
          </div>
        </div>
        
        <div class="section">
          <h2>Missing Keywords</h2>
          <div class="keywords">
            ${(analysisData?.missingKeywords || []).map(k => `<span class="keyword missing">${k}</span>`).join("")}
          </div>
        </div>
        
        <div class="section">
          <h2>Suggestions</h2>
          <ul class="suggestions">
            ${(analysisData?.suggestions || []).map(s => `<li class="priority-${s.priority}"><strong>${s.category}:</strong> ${s.suggestion}</li>`).join("")}
          </ul>
        </div>
        
        <div class="section">
          <h2>Your Strengths</h2>
          <div class="strengths">
            ${(analysisData?.strengthsHighlights || []).map(s => `<span class="strength">✓ ${s}</span>`).join("")}
          </div>
        </div>
        
        <div class="section">
          <h2>Formatting Tips</h2>
          <div class="tips">
            ${(analysisData?.formattingTips || []).map(t => `<span class="tip">💡 ${t}</span>`).join("")}
          </div>
        </div>
        
        <div class="footer">
          <p>AI Resume Analyzer & ATS Checker | Powered by Gemini AI</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
    setExporting(false);
  };

  return (
    <button onClick={handleExport} className="export-pdf-btn" disabled={exporting}>
      {exporting ? "Generating..." : "📥 Export PDF Report"}
    </button>
  );
};

export default ExportPDF;
