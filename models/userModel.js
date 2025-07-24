const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Name of users must be at least 3 characters"],
    required: true,
    trim: true,
  },
  history: [],
  role: {
    type: String,
    enum: ["admin", "owner", "user"],
    default: "user",
  },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  gender: { type: String, enum: ["male", "female"], default: "other" },
  birthday: { type: Date }, // Changed from Date to String to avoid timezone issues
  token: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
  },
});

const UserModel = mongoose.model("User", usersSchema);

module.exports = {UserModel};
