import express from "express";
import { createComplaint, getComplaints, replyComplaint } from "../controllers/complaint.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Buyer/Seller can file complaint
router.post("/", verifyToken, createComplaint); // senderUsername comes from req.user

// Admin can view all complaints
router.get("/", verifyToken, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json("Access denied");
  next();
}, getComplaints);

// Admin can reply to complaint
router.put("/:id/reply", verifyToken, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json("Access denied");
  next();
}, replyComplaint);

export default router;
