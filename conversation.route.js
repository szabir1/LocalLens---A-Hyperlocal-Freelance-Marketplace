import express from "express";
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
  createOrGetConversation // New
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Existing routes
router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, createConversation);
router.get("/single/:id", verifyToken, getSingleConversation);
router.put("/:id", verifyToken, updateConversation);

// ✅ New route to create or get conversation between buyer and seller
router.get("/orcreate/:sellerId", verifyToken, createOrGetConversation);

export default router;
