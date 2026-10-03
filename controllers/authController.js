/**
 * TIPPED — Authentication Controller
 * File: controllers/authController.js
 */

const { User } = require('../models/tipped-mongoose-models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret Key (Defaults to local secret if env variable not set)
const JWT_SECRET = process.env.JWT_SECRET || 'tipped_tip_manila_secret_key_2026';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new T.I.P. Student, Faculty, or Admin user
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { fullName, tipEmail, password, role, department } = req.body;

    // 1. Validate required fields
    if (!fullName || !tipEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, T.I.P. email, and password are required.'
      });
    }

    // 2. Enforce @tip.edu.ph domain validation
    const tipEmailRegex = /^[a-zA-Z0-9._%+-]+@tip\.edu\.ph$/;
    if (!tipEmailRegex.test(tipEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Registration restricted to official @tip.edu.ph institutional emails.'
      });
    }

    // 3. Check for existing account
    const existingUser = await User.findOne({ tipEmail: tipEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this T.I.P. email address already exists.'
      });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Create user record
    const user = await User.create({
      fullName,
      tipEmail: tipEmail.toLowerCase(),
      passwordHash,
      role: role || 'User',
      department: department || 'General Academic'
    });

    // 6. Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, tipEmail: user.tipEmail, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        tipEmail: user.tipEmail,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { tipEmail, password } = req.body;

    if (!tipEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both institutional email and password.'
      });
    }

    // Find user and explicitly select passwordHash
    const user = await User.findOne({ tipEmail: tipEmail.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, tipEmail: user.tipEmail, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        tipEmail: user.tipEmail,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};
