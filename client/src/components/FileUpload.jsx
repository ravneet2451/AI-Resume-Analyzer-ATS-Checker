import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUpload.css";

const FileUpload = ({ onFileSelect, selectedFile }) => {
  const [dragError, setDragError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setDragError("");

      if (rejectedFiles && rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === "file-too-large") {
          setDragError("File is too large. Maximum size is 5MB.");
        } else if (error.code === "file-invalid-type") {
          setDragError("Invalid file type. Please upload PDF or DOCX only.");
        } else {
          setDragError("Invalid file. Please try again.");
        }
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/msword": [".doc"],
      },
      maxSize: 5 * 1024 * 1024,
      multiple: false,
    });

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") {
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1.5"/>
          <polyline points="14 2 14 8 20 8" stroke="#ef4444" strokeWidth="1.5"/>
          <text x="7" y="18" fontSize="5" fill="#ef4444" fontWeight="bold">PDF</text>
        </svg>
      );
    }
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="#6366f1" opacity="0.2" stroke="#6366f1" strokeWidth="1.5"/>
        <polyline points="14 2 14 8 20 8" stroke="#6366f1" strokeWidth="1.5"/>
        <text x="5" y="18" fontSize="4" fill="#6366f1" fontWeight="bold">DOCX</text>
      </svg>
    );
  };

  return (
    <div className="file-upload-wrapper">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "drag-active" : ""} ${
          isDragReject ? "drag-reject" : ""
        } ${selectedFile ? "has-file" : ""}`}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          /* File Selected State */
          <div className="file-selected">
            <div className="file-icon">{getFileIcon(selectedFile.name)}</div>
            <div className="file-info">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{formatFileSize(selectedFile.size)}</p>
            </div>
            <div className="file-success-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Ready
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="dropzone-content">
            <div className={`dropzone-icon ${isDragActive ? "bounce" : ""}`}>
              {isDragActive ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="url(#uploadGrad)" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="17 8 12 3 7 8" stroke="url(#uploadGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke="url(#uploadGrad)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="uploadGrad" x1="0" y1="0" x2="24" y2="24">
                      <stop offset="0%" stopColor="#6366f1"/>
                      <stop offset="100%" stopColor="#8b5cf6"/>
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#6366f1" strokeWidth="1.5" fill="rgba(99,102,241,0.1)"/>
                  <polyline points="14 2 14 8 20 8" stroke="#6366f1" strokeWidth="1.5"/>
                  <line x1="12" y1="18" x2="12" y2="12" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="9 15 12 12 15 15" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            <div className="dropzone-text">
              {isDragActive ? (
                <p className="drop-text">Drop your resume here!</p>
              ) : (
                <>
                  <p className="drop-text">
                    Drag & drop your resume here
                  </p>
                  <p className="drop-subtext">or click to browse files</p>
                </>
              )}
            </div>

            <div className="dropzone-formats">
              <span className="format-badge">PDF</span>
              <span className="format-badge">DOCX</span>
              <span className="format-badge">DOC</span>
              <span className="format-size">Max 5MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {dragError && (
        <div className="upload-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {dragError}
        </div>
      )}

      {/* Change file button */}
      {selectedFile && (
        <button
          className="change-file-btn"
          onClick={(e) => {
            e.stopPropagation();
            onFileSelect(null);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Change File
        </button>
      )}
    </div>
  );
};

export default FileUpload;
