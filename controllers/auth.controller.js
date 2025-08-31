import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);

    const newUser = new User({
      ...req.body,
      password: hash,
      role: "buyer",      // Default role is buyer
      isBanned: false,    // Default not banned
      isSeller: false,    // Default not seller
    });

    await newUser.save();
    res.status(201).json({ message: "User has been created" });
  } catch (err) {
    console.error("Register error:", err);
    next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    console.log("Login attempt username:", req.body.username); // DEBUG

    const user = await User.findOne({ username: req.body.username });
    console.log("User found:", user); // DEBUG

    if (!user) return res.status(404).json({ message: "User not found" });

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return res.status(400).json({ message: "Wrong password" });

    if (user.isBanned) {
      return res.status(403).json({ message: "You have been banned by admin" });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    // Return only safe fields
    const safeUser = {
      _id: user._id,
      username: user.username,
      role: user.role,
      isSeller: user.isSeller,
      img: user.img || null,
    };

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json(safeUser);

  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res
      .clearCookie("accessToken", {
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "User has been logged out" });
  } catch (err) {
    console.error("Logout error:", err);
  }
};
