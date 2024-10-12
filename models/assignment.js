const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
