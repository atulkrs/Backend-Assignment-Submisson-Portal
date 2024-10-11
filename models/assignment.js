const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  admin: {
    type: String, // Reference to the Admin's userId
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
