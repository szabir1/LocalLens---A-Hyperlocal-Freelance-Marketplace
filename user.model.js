import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    desc: {
      type: String,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },

    // ✅ NEW: Role field
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"], // only allow these
      default: "buyer", // by default every new user is buyer
    },

    // ✅ Optional: banned flag
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
