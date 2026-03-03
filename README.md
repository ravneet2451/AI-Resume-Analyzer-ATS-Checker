# 🤖 AI Resume Analyzer & ATS Checker

An AI-powered full-stack web application that analyzes resumes against job descriptions, calculates ATS (Applicant Tracking System) scores, and provides actionable improvement suggestions using Google Gemini AI.

---

## ✨ Features

- 📄 **Resume Upload** — Supports PDF and DOCX formats (up to 5MB)
- 🎯 **ATS Score** — 0–100 score showing how well your resume matches the job
- 🔍 **Keyword Analysis** — Matched vs. missing keywords from the job description
- 🧠 **Skills Gap Analysis** — Identify missing skills with match percentage
- 💡 **AI Suggestions** — Prioritized, actionable improvement tips
- 📊 **Section Analysis** — Scores for Contact, Summary, Experience, Education, Skills
- ⭐ **Strengths Highlight** — What your resume does well
- 🎨 **Modern Dark UI** — Responsive, beautiful interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) + CSS |
| Backend | Node.js + Express.js |
| AI Engine | Google Gemini 1.5 Flash API |
| File Parsing | pdf-parse + mammoth |
| File Upload | multer |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Google Gemini API key (free at https://aistudio.google.com/app/apikey)

### 1. Clone & Setup

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure API Key

Edit `server/.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```

### 3. Run the Application

**Terminal 1 — Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Start Frontend:**
```bash
cd client
npm run dev
```

### 4. Open in Browser
Navigate to: **http://localhost:5173**

---

## 📁 Project Structure

```
AI Resume Analyzer & ATS Checker/
├── client/                    ← React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── JobDescription.jsx
│   │   │   ├── ATSScore.jsx
│   │   │   ├── KeywordAnalysis.jsx
│   │   │   ├── Suggestions.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Results.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                    ← Node.js + Express Backend
│   ├── routes/analyze.js
│   ├── controllers/analyzeController.js
│   ├── middleware/upload.js
│   ├── utils/
│   │   ├── fileParser.js
│   │   └── geminiAI.js
│   ├── .env
│   └── index.js
│
└── README.md
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Analyze resume |

### POST `/api/analyze`
**Form Data:**
- `resume` — PDF or DOCX file
- `jobDescription` — Job description text (min 50 chars)

**Response:**
```json
{
  "success": true,
  "data": {
    "atsScore": 78,
    "overallAssessment": "...",
    "matchedKeywords": [...],
    "missingKeywords": [...],
    "skillsAnalysis": { ... },
    "sectionAnalysis": { ... },
    "suggestions": [...],
    "formattingTips": [...],
    "strengthsHighlights": [...]
  }
}
```

---

## 📝 License

MIT License — feel free to use and modify.
