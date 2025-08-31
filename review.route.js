import express from "express";
import { createReview, getReviews } from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createReview); // Auth required
router.get("/:gigId", getReviews);

export default router;
