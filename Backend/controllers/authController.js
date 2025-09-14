const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Generate Refresh Token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

// Set JWT Cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  const refreshOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  console.log('🍪 Setting cookies with options:', {
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite
  });

  res
    .status(statusCode)
    .cookie("token", token, options)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json({
      success: true,
      message: statusCode === 200 ? "Login successful" : "Registration successful",
      token,
      user: user.toJSON(), // Use toJSON method instead of publicProfile
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  console.log('\n🔥 === REGISTRATION REQUEST START ===');
  console.log('🕐 Timestamp:', new Date().toISOString());
  console.log('🌐 Request IP:', req.ip || req.connection.remoteAddress);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📦 Raw Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    console.log('🔍 Extracted Fields:');
    console.log('  - Name:', name);
    console.log('  - Email:', email);
    console.log('  - Password Length:', password ? password.length : 'undefined');
    console.log('  - Confirm Password Length:', confirmPassword ? confirmPassword.length : 'undefined');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log('❌ Validation failed: Passwords do not match');
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    console.log('✅ Basic validation passed');

    // Check if user exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
    
    console.log('✅ Email is available');

    // Create user
    console.log('👤 Creating new user...');
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password,
    };
    
    console.log('📝 User data to save:', {
      name: userData.name,
      email: userData.email,
      password: '***hidden***'
    });

    const user = await User.create(userData);
    
    console.log('✅ User created successfully!');
    console.log('🆔 User ID:', user._id);
    console.log('📧 User Email:', user.email);

    // Update last login
    console.log('📅 Updating last login...');
    await user.updateLastLogin();
    console.log('✅ Last login updated');

    console.log('🎯 Sending token response...');
    sendTokenResponse(user, 201, res);
    
    console.log('🔥 === REGISTRATION REQUEST SUCCESS ===\n');
    
  } catch (error) {
    console.log('\n💥 === REGISTRATION ERROR ===');
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Handle validation errors
    if (error.name === "ValidationError") {
      console.log('📋 Validation errors:', error.errors);
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      console.log('🔄 Duplicate key error:', error.keyValue);
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      console.log('🔌 MongoDB connection error');
      return res.status(500).json({
        success: false,
        message: "Database connection error. Please try again later.",
      });
    }

    console.log('💥 === REGISTRATION ERROR END ===\n');

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// @desc    Login user  
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  console.log('\n🔥 === LOGIN REQUEST START ===');
  console.log('🕐 Timestamp:', new Date().toISOString());
  console.log('📦 Request body:', { 
    email: req.body.email, 
    passwordProvided: !!req.body.password 
  });

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    console.log('🔍 Looking for user with email:', email);

    // Check for user (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    
    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log('✅ User found:', user.email);

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is deactivated');
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Check password
    console.log('🔒 Verifying password...');
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('❌ Password verification failed');
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log('✅ Password verified successfully');

    // Update last login
    await user.updateLastLogin();
    
    console.log('🎯 Sending login response...');
    sendTokenResponse(user, 200, res);
    
    console.log('🔥 === LOGIN REQUEST SUCCESS ===\n');

  } catch (error) {
    console.log('\n💥 === LOGIN ERROR ===');
    console.error('❌ Login error:', error);
    console.log('💥 === LOGIN ERROR END ===\n');
    
    res.status(500).json({
      success: false,
      message: "Server error during login",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// ... rest of your controller methods (logout, getMe, etc.) remain the same

const logout = async (req, res) => {
  console.log('👋 Logout request received');
  try {
    // Clear refresh token from database
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        refreshToken: null,
      });
    }

    res
      .cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      })
      .cookie("refreshToken", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Logout successful",
      });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user data",
    });
  }
};

const updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Update details error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all password fields",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating password",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  refreshToken,
};