import express from "express";
import {
  createResume,
  getResume,
  updateResume,
  deleteResume,
  generateSummary,
  getResumeById,
  generatePDFController,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadFile } from "../controllers/resumeController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createResume);
router.get("/", protect, getResume);
router.put("/:id", protect, updateResume);
router.delete("/:id", protect, deleteResume);
router.post("/generate-summary", protect, generateSummary);
router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/:id", protect, getResumeById);
router.get("/pdf", protect, generatePDFController);

export default router;
