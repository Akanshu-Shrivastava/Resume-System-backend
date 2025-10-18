import Resume from "../models/resume.js";

// 🟢 Create or Update Resume
export const createOrUpdateResume = async (req, res) => {
  try {
    const { personalInfo, education, experience, projects, skills, achievements } = req.body;

    let resume = await Resume.findOne({ user: req.user._id });

    if (resume) {
      resume.personalInfo = personalInfo;
      resume.education = education;
      resume.experience = experience;
      resume.projects = projects;
      resume.skills = skills;
      resume.achievements = achievements;
      await resume.save();
      return res.json({ message: "Resume updated successfully", resume });
    } else {
      resume = new Resume({
        user: req.user._id,
        personalInfo,
        education,
        experience,
        projects,
        skills,
        achievements,
      });
      await resume.save();
      return res.status(201).json({ message: "Resume created successfully", resume });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 Get Resume
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 Delete Resume
export const deleteResume = async (req, res) => {
  try {
    await Resume.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✨ Auto-generate Resume Summary
export const generateSummary = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const { personalInfo, education, experience, projects, skills, achievements } = resume;

    // Basic text-based summary logic
    let summary = `Professional Summary for ${personalInfo?.fullName || "the candidate"}:\n\n`;

    if (education?.length > 0) {
      summary += `🎓 Education: Graduated in ${education[0].degree} from ${education[0].institution} (${education[0].year}) with a grade of ${education[0].grade}.\n\n`;
    }

    if (experience?.length > 0) {
      summary += `💼 Experience: Worked at ${experience[0].company} as ${experience[0].position} for ${experience[0].duration}, focusing on ${experience[0].description}.\n\n`;
    }

    if (projects?.length > 0) {
      summary += `🚀 Project: ${projects[0].title} — ${projects[0].description} using ${projects[0].techStack.join(", ")}.\n\n`;
    }

    if (skills?.length > 0) {
      summary += `🧩 Key Skills: ${skills.join(", ")}.\n\n`;
    }

    if (achievements?.length > 0) {
      summary += `🏅 Achievements: ${achievements.join(", ")}.\n\n`;
    }

    summary += `This summary is auto-generated to highlight the candidate's technical strengths and professional experience.`;

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

