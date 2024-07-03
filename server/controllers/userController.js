const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password || !firstname) {
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        })
    }

    const user = await User.findOne({ email });
    if (user) {
        throw new Error('This user email address already exists');
    } else {
        const newUser = await User.create(req.body);
        return res.status(200).json({
            success: newUser ? true : false,
            message: newUser ? 'Register is successfully, please login' : 'Something went wrong'
        })
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        })
    }

    const response = await User.findOne({ email });
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, ...userData } = response.toObject();
        return res.status(200).json({
            success: true,
            userData
        })
    } else {
        throw new Error('Invalid credentials!');
    }
});

module.exports = {
    register,
    login
}