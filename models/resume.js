// models/Resume.js
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    github: String,
    profilePic: String
  },
  summary: String,
  education: [
    {
      degree: String,
      institution: String,
      year: String,
      gpa: String
    }
  ],
  experience: [
    {
      jobTitle: String,
      company: String,
      startDate: String,
      endDate: String,
      description: String
    }
  ],
  skills: {
    type: [String],
    required: true
  },
  projects: [
    {
      title: String,
      description: String,
      technologies: [String]
    }
  ],
  certifications: [String],
  additionalInfo: {
    hobbies: [String],
    languages: [String]
  }
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
