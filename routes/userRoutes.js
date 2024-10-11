const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/user'); // Importing User model
const router = express.Router();

// User registration route
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
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
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Create a new user with default role 'user'
      user = new User({ username, password, role: 'user' });
      await user.save();

      
      res.status(201).json({ msg: 'User registered successfully', user: { username: user.username, role: user.role } });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// User login route
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
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
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      if (user.password !== password) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Send response on successful login
      res.status(200).json({ msg: 'Login successful', user: { username: user.username, role: user.role } });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Fetch all admins route
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    console.log('Fetched Admins:', admins);
    if (!admins.length) {
      return res.status(404).json({ msg: 'No admins found' });
    }
    res.status(200).json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
