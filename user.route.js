import express from "express";
import { deleteUser, getUser, getAllUsers, banUser } from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/jwt.js";

const router = express.Router();

// ⚡️ Admin routes first so they don't get shadowed by :id
router.get("/", verifyToken, verifyAdmin, getAllUsers); // Get all users for admin dashboard
router.put("/ban/:id", verifyToken, verifyAdmin, banUser); // Ban a user

// ⚡️ Normal user routes after
router.get("/:id", verifyToken, getUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
