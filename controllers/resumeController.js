import Resume from "../models/resume.js";
import { generateResumePDF } from "../utils/generateResumePDF.js";

// 🧠 Utility: Generate an automatic summary if user didn’t provide one
const generateAutoSummary = (resume) => {
  const { personalInfo, skills, education, experience } = resume;

  const firstName = personalInfo?.firstName || "This individual";
  const lastName = personalInfo?.lastName ? ` ${personalInfo.lastName}` : "";
  const name = `${firstName}${lastName}`;

  const skillText = skills?.length
    ? `skilled in ${skills.slice(0, 3).join(", ")}`
    : "with a diverse skill set";

  const eduText = education?.length
    ? `having studied at ${education[0].institution}`
    : "with a strong academic foundation";

  const expText = experience?.length
    ? `and experienced in ${experience[0].role} at ${experience[0].company}`
    : "";

  return `${name} is a passionate professional ${skillText}, ${eduText} ${expText}. 
They are eager to contribute to innovative projects and continue learning new technologies.`;
};

// ====================== CREATE RESUME ======================
export const createResume = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    const resumeData = req.body;

    // ✅ Auto-generate summary if not provided
    let summaryText = resumeData.summary?.trim();
    if (!summaryText) {
      summaryText = generateAutoSummary(resumeData);
    }

    const resume = new Resume({
      ...resumeData,
      user: req.user.id,
      summary: summaryText,
    });

    await resume.save();

    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Error creating resume:", error);
    return res.status(500).json({ success: false, message: "Error creating resume" });
  }
};

// ====================== GET ALL RESUMES ======================
export const getResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id });
    return res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET SINGLE RESUME ======================
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    return res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching single resume:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== UPDATE RESUME ======================
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    // Merge updates
    Object.assign(resume, req.body);

    // ✅ Regenerate summary if none provided in the update
    if (!req.body.summary?.trim()) {
      resume.summary = generateAutoSummary(resume);
    }

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    return res.status(500).json({ success: false, message: "Error updating resume" });
  }
};

// ====================== DELETE RESUME ======================
export const deleteResume = async (req, res) => {
  try {
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    return res.status(200).json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return res.status(500).json({ success: false, message: "Error deleting resume" });
  }
};

// ====================== AUTO SUMMARY API ======================
export const generateSummary = async (req, res) => {
  try {
    const summary = generateAutoSummary(req.body);
    return res.status(200).json({ success: true, autoSummary: summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return res.status(500).json({ success: false, message: "Error generating summary" });
  }
};

// ====================== FILE UPLOAD ======================
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return res.status(200).json({ success: true, fileUrl });
  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({ success: false, message: "Error uploading file" });
  }
};

// ====================== GENERATE PDF ======================
export const generatePDFController = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    const pdfBuffer = await generateResumePDF(resume.toObject());
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resume.personalInfo.fullName || "Resume"}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
