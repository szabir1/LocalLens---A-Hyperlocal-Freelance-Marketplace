import express from "express";
import {
  getUsers,
  getGigs,
  getOrders,
  getMessages,
} from "../controllers/admin.controller.js";

import { banUser } from "../controllers/user.controller.js"; // ✅ import banUser from user.controller
import { verifyToken, verifyAdmin } from "../middleware/jwt.js";

const router = express.Router();

// Admin routes
router.get("/users", verifyToken, verifyAdmin, getUsers);
router.get("/gigs", verifyToken, verifyAdmin, getGigs);
router.get("/orders", verifyToken, verifyAdmin, getOrders);
router.get("/messages", verifyToken, verifyAdmin, getMessages);

// Ban user route
router.put("/ban/:id", verifyToken, verifyAdmin, banUser);

export default router;
