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
 * @desc    Register a new T.I.P. Student or Faculty user
 * @access  Public
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, tipEmail, password, role, department, username } = req.body;
  const userEmail = (email || tipEmail || '').trim().toLowerCase();

  // 1. Validate required fields
  if (!fullName || !userEmail || !password) {
    return next(new AppError('Full name, T.I.P. email, and password are required.', 400));
  }

  // 2. Enforce @tip.edu.ph domain validation
  const tipEmailRegex = /^[a-zA-Z0-9._%+-]+@tip\.edu\.ph$/;
  if (!tipEmailRegex.test(userEmail)) {
    return next(new AppError('Registration restricted to official @tip.edu.ph institutional emails.', 400));
  }

  // 3. Disallow public staff/admin self-registration
  const normalizedRole = (role || 'student').toLowerCase();
  if (normalizedRole === 'admin' || normalizedRole === 'staff' || normalizedRole === 'superadmin') {
    return next(new AppError('Staff and Admin accounts are provisioned by Campus IT. Public registration is not permitted.', 403));
  }

  // 4. Check for existing account
  const existingUser = await User.findOne({
    $or: [{ email: userEmail }, { tipEmail: userEmail }]
  });
  if (existingUser) {
    return next(new AppError('An account with this T.I.P. email address already exists.', 409));
  }

  // 5. Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 6. Create user record
  const user = await User.create({
    fullName,
    username: username ? username.toLowerCase().trim() : userEmail.split('@')[0],
    email: userEmail,
    tipEmail: userEmail,
    passwordHash,
    role: normalizedRole,
    department: department || 'General Academic'
  });

  // 7. Generate JWT Token
  const token = jwt.sign(
    { userId: user._id, email: user.email, tipEmail: user.tipEmail, role: user.role },
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
      username: user.username,
      email: user.email,
      tipEmail: user.tipEmail,
      role: user.role,
      department: user.department
    }
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token (Dual-identity: supports email or username)
 * @access  Public
 */
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { identifier, email, tipEmail, username, loginId, password } = req.body;
  const loginIdentifier = (identifier || email || tipEmail || username || loginId || '').trim();

  if (!loginIdentifier || !password) {
    return next(new AppError('Please provide both username or institutional email and password.', 400));
  }

  // Find user matching EITHER email OR username OR tipEmail
  const user = await User.findOne({
    $or: [
      { email: loginIdentifier.toLowerCase() },
      { tipEmail: loginIdentifier.toLowerCase() },
      { username: loginIdentifier.toLowerCase() },
      { fullName: new RegExp(`^${loginIdentifier}$`, 'i') }
    ]
  }).select('+passwordHash +password');

  if (!user) {
    return next(new AppError('Invalid credentials.', 401));
  }

  // Verify password with bcrypt (supports passwordHash or password field)
  const hash = user.passwordHash || user.password;
  const isMatch = await bcrypt.compare(password, hash);
  if (!isMatch) {
    return next(new AppError('Invalid credentials.', 401));
  }

  // Generate JWT Token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email || user.tipEmail,
      role: user.role,
      department: user.department || ''
    },
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
      username: user.username,
      email: user.email || user.tipEmail,
      tipEmail: user.tipEmail || user.email,
      role: user.role,
      department: user.department || ''
    }
  });
});
