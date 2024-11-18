const mongoose = require('mongoose');
const User = require('../models/userSchema'); // Import your User model
const dotenv = require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');

    } catch (error) {
        console.log('DB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
