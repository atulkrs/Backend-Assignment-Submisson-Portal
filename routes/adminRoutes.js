const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Assignment = require("../models/assignment");
const router = express.Router();

// Admin registration route
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      let admin = await User.findOne({ username, role: "admin" });
      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Admin already exists" }] });
      }

      admin = new User({ username, password, role: "admin" });
      await admin.save();

      console.log("New Admin Created:", admin);

      res.status(201).json({
        msg: "Member registered successfully",
        member: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Admin login route
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const admin = await User.findOne({ username, role: "admin" });
      if (!admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid admin credentials" }] });
      }

      if (admin.password !== password) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid admin credentials" }] });
      }

      // Send response on successful login
      res.status(200).json({
        msg: "Admin login successful",
        member: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
router.get("/users", async (req, res) => {
  try {
    // Find all users with the role 'user'
    const users = await User.find({ role: "user" });

    // Check if any users exist
    if (!users.length) {
      return res.status(404).json({ msg: "No users found" });
    }

    const formattedUsers = users.map((user) => ({
      id: user._id,
      username: user.username,
      role: user.role,
    }));

    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// View assignments route
router.get("/assignments/admins/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const admin = await User.findOne({ username, role: "admin" });
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    const assignments = await Assignment.find({ admin: admin._id })
      .populate("userId", "username")
      .populate("admin", "username");

    const formattedAssignments = assignments.map((assignment) => ({
      user: {
        id: assignment.userId ? assignment.userId._id : null,
        name: assignment.userId ? assignment.userId.username : "Unknown User",
      },
      task: assignment.task,
      createdAt: assignment.createdAt,
      status: assignment.status,
      admin: {
        id: admin._id,
        name: admin.username,
      },
    }));

    res.status(200).json(formattedAssignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Accept assignment route
router.post("/assignments/:id/accept", async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const assignment = await Assignment.findById(assignmentId)
      .populate("userId", "username")
      .populate("admin", "username");

    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    // Update the assignment status to accepted
    assignment.status = "accepted";
    await assignment.save();

    res.status(200).json({
      msg: "Assignment accepted",
      assignment: {
        id: assignment._id,
        user: {
          id: assignment.userId._id,
          username: assignment.userId.username,
        },
        task: assignment.task,
        admin: {
          id: assignment.admin._id,
          username: assignment.admin.username,
        },
        status: assignment.status,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Reject assignment route
router.post("/assignments/:id/reject", async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const assignment = await Assignment.findById(assignmentId)
      .populate("userId", "username")
      .populate("admin", "username");

    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    // Update the assignment status to rejected
    assignment.status = "rejected";
    await assignment.save();

    res.status(200).json({
      msg: "Assignment rejected",
      assignment: {
        id: assignment._id,
        user: {
          id: assignment.userId._id,
          username: assignment.userId.username,
        },
        task: assignment.task,
        admin: {
          id: assignment.admin._id,
          username: assignment.admin.username,
        },
        status: assignment.status,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
