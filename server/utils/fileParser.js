const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

/**
 * Extract text from uploaded file buffer
 * Supports PDF and DOCX formats
 */
const extractTextFromFile = async (fileBuffer, originalName) => {
  const ext = path.extname(originalName).toLowerCase();

  try {
    if (ext === ".pdf") {
      return await extractFromPDF(fileBuffer);
    } else if (ext === ".docx" || ext === ".doc") {
      return await extractFromDOCX(fileBuffer);
    } else {
      throw new Error("Unsupported file format. Please upload PDF or DOCX.");
    }
  } catch (error) {
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

/**
 * Extract text from PDF buffer
 */
const extractFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    if (!data.text || data.text.trim().length === 0) {
      throw new Error(
        "Could not extract text from PDF. The file may be image-based or corrupted."
      );
    }
    return data.text.trim();
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

/**
 * Extract text from DOCX buffer
 */
const extractFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    if (!result.value || result.value.trim().length === 0) {
      throw new Error(
        "Could not extract text from DOCX. The file may be corrupted."
      );
    }
    return result.value.trim();
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
};

module.exports = { extractTextFromFile };
