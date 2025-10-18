import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrUpdateResume, getResume, deleteResume, generateSummary } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/", protect, createOrUpdateResume);
router.get("/", protect, getResume);
router.delete("/", protect, deleteResume);
router.get("/summary", protect, generateSummary);


export default router;
