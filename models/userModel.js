const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name of users must be at least 3 characters'],
    required: true,
    trim: true,
  },
  history: [],
  authorization: {
    role: {
      type: String,
      enum: ["admin", "owner", "user"],
      default: "user"
    }
  },
  email: String,
  phone: String,
  gender: String,
  birthday: String
});

const mongooseModel = mongoose.model("User", usersSchema);

module.exports = mongooseModel;