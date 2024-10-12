const express = require("express");
const { body, validationResult } = require("express-validator");
const Assignment = require("../models/assignment");
const User = require("../models/user"); // Import the User model
const router = express.Router();

// Upload assignment route
router.post(
  "/upload",
  [
    body("userId").notEmpty().withMessage("Username is required"),
    body("task").notEmpty().withMessage("Task is required"),
    body("admin").notEmpty().withMessage("Admin is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, task, admin } = req.body;

    try {
      const uniqueLabel = `Upload Time - ${new Date().toISOString()}`;
      console.time(uniqueLabel);

      // Check if the user exists and has the role 'user'
      const user = await User.findOne({ username: userId, role: "user" });
      if (!user) {
        return res
          .status(404)
          .json({ msg: "No users exist with the given username" });
      }

      // Check if the admin exists and get their ObjectId
      const adminUser = await User.findOne({ username: admin, role: "admin" });
      if (!adminUser) {
        return res.status(404).json({ msg: "Admin does not exist" });
      }

      // Check if the same assignment already exists
      const existingAssignment = await Assignment.findOne({
        userId: user._id,
        task,
        admin: adminUser._id,
      });
      if (existingAssignment) {
        return res.status(400).json({ msg: "Assignment already uploaded" });
      }

      const assignment = new Assignment({
        userId: user._id,
        task,
        admin: adminUser._id,
      });
      await assignment.save();

      const populatedAssignment = await Assignment.findById(assignment._id)
        .populate("userId", "username")
        .populate("admin", "username");

      console.timeEnd(uniqueLabel);
      res.status(201).json({
        msg: "Assignment uploaded successfully",
        assignment: populatedAssignment,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
