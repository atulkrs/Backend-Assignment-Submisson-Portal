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
        msg: "Admin registered successfully",
        admin: { username: admin.username, role: admin.role },
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
        admin: { username: admin.username, role: admin.role },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// View assignments route
router.get("/assignments", async (req, res) => {
  try {
    // Fetch assignments assigned to this admin
    const assignments = await Assignment.find({ admin: req.admin.id });
    res.status(200).json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Accept assignment route
router.post("/assignments/:id/accept", async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    assignment.status = "accepted";
    await assignment.save();

    res.status(200).json({ msg: "Assignment accepted", assignment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Reject assignment route
router.post("/assignments/:id/reject", async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    assignment.status = "rejected";
    await assignment.save();

    res.status(200).json({ msg: "Assignment rejected", assignment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
