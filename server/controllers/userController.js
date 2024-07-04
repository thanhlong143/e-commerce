const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');

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
        const accessToken = generateAccessToken(response._id, role);
        const refreshToken = generateRefreshToken(response._id);

        await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        });
    } else {
        throw new Error('Invalid credentials!');
    }
});

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id).select('-refreshToken -password -role');
    console.log(user);
    return res.status(200).json({
        success: true,
        result: user ? user : 'User not found'
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie || !cookie.refreshToken) {
        throw new Error('No refresh token in cookies');
    }

    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({ _id: result._id, refreshToken: cookie.refreshToken });
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._is, response.role) : 'Refresh token is not match'
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken) {
        throw new Error('No refresh token in cookies');
    }
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    return res.status(200).json({
        success: true,
        message: 'Logout is done'
    })
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) {
        throw new Error('Missing email!');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found!');
    }
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout
}