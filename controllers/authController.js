/**
 * TIPPED — Authentication Controller
 * File: controllers/authController.js
 */

const { User } = require('../models/tipped-mongoose-models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// JWT Secret Key (Defaults to local secret if env variable not set)
const JWT_SECRET = process.env.JWT_SECRET || 'tipped_tip_manila_secret_key_2026';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new T.I.P. Student, Faculty, or Admin user
 * @access  Public
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, tipEmail, password, role, department } = req.body;

  // 1. Validate required fields
  if (!fullName || !tipEmail || !password) {
    return next(new AppError('Full name, T.I.P. email, and password are required.', 400));
  }

  // 2. Enforce @tip.edu.ph domain validation
  const tipEmailRegex = /^[a-zA-Z0-9._%+-]+@tip\.edu\.ph$/;
  if (!tipEmailRegex.test(tipEmail)) {
    return next(new AppError('Registration restricted to official @tip.edu.ph institutional emails.', 400));
  }

  // 3. Check for existing account
  const existingUser = await User.findOne({ tipEmail: tipEmail.toLowerCase() });
  if (existingUser) {
    return next(new AppError('An account with this T.I.P. email address already exists.', 409));
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
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token (supports email or username)
 * @access  Public
 */
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { tipEmail, username, loginId, password } = req.body;
  const identifier = (loginId || tipEmail || username || '').trim();

  if (!identifier || !password) {
    return next(new AppError('Please provide both username or institutional email and password.', 400));
  }

  // Find user by either institutional email or username/name
  const user = await User.findOne({
    $or: [
      { tipEmail: identifier.toLowerCase() },
      { username: identifier.toLowerCase() },
      { fullName: new RegExp(`^${identifier}$`, 'i') }
    ]
  }).select('+passwordHash');

  if (!user) {
    return next(new AppError('Invalid credentials.', 401));
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return next(new AppError('Invalid credentials.', 401));
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
      username: user.username,
      role: user.role,
      department: user.department
    }
  });
});


