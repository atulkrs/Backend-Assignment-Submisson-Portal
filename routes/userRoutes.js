const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/user"); // Importing User model
const router = express.Router();

// User registration route
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
      // Check if the user already exists
      let user = await User.findOne({ username });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      user = new User({ username, password, role: "user" });
      await user.save();

      res.status(201).json({
        msg: "Member registered successfully",
        member: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// User login route
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
      // Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      if (user.password !== password) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      res.status(200).json({
        msg: "User Login successful",
        member: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    console.log("Fetched Users:", users);

    if (!users.length) {
      return res.status(404).json({ msg: "No users found" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Fetch all admins route
router.get("/admins", async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    console.log("Fetched Admins:", admins);
    if (!admins.length) {
      return res.status(404).json({ msg: "No admins found" });
    }
    res.status(200).json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
