import Complaint from "../models/complaint.model.js";
import User from "../models/user.model.js"; // Make sure this path is correct
import createError from "../utils/createError.js";

// Create complaint
export const createComplaint = async (req, res, next) => {
  try {
    const { againstUsername, message } = req.body;

    // Find the user by username
    const againstUser = await User.findOne({ username: againstUsername });
    if (!againstUser) return next(createError(404, "User not found"));

    const complaint = new Complaint({
      senderId: req.userId,            // logged-in user
      againstId: againstUser._id,      // convert username to ID
      message,
    });

    const savedComplaint = await complaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    next(err);
  }
};

// Get complaints (Admin only)
export const getComplaints = async (req, res, next) => {
  try {
    if (!req.isAdmin) return next(createError(403, "Only admins can view complaints!"));
    const complaints = await Complaint.find()
      .populate("senderId", "username")
      .populate("againstId", "username");
    res.status(200).json(complaints);
  } catch (err) {
    next(err);
  }
};

// Reply to complaint (Admin only)
export const replyComplaint = async (req, res, next) => {
  try {
    if (!req.isAdmin) return next(createError(403, "Only admins can reply!"));
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { reply: req.body.reply, status: "resolved" },
      { new: true }
    );
    res.status(200).json(complaint);
  } catch (err) {
    next(err);
  }
};
