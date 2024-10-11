const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON requests

// API Endpoints
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/users/assignments', assignmentRoutes); 

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
