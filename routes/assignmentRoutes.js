const express = require('express');
const { body, validationResult } = require('express-validator');
const Assignment = require('../models/assignment'); 
const router = express.Router();

// Upload assignment route
router.post('/upload', [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('task').notEmpty().withMessage('Task is required'),
    body('admin').notEmpty().withMessage('Admin username is required'),
], async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, task, admin } = req.body;

    try {
        // Create a new assignment
        const newAssignment = new Assignment({ userId, task, admin });
        await newAssignment.save();

        res.status(201).json({ msg: 'Assignment uploaded successfully', assignment: newAssignment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Admin View Assignments route
router.get('/admins/:adminUsername', async (req, res) => {
    const { adminUsername } = req.params;

    try {
        // Fetch assignments for the specified admin
        const assignments = await Assignment.find({ admin: adminUsername });
        res.status(200).json(assignments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Accept assignment route
router.post('/accept/:id', async (req, res) => {
    const assignmentId = req.params.id;

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        assignment.status = 'accepted';
        await assignment.save();

        res.status(200).json({ msg: 'Assignment accepted', assignment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Reject assignment route
router.post('/reject/:id', async (req, res) => {
    const assignmentId = req.params.id;

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        assignment.status = 'rejected';
        await assignment.save();

        res.status(200).json({ msg: 'Assignment rejected', assignment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
