const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// In-memory user storage (for demo purposes)
// In production, use a database like MongoDB
const users = [];

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required.",
      });
    }

    // Check if email already exists
    const existingUser = users.find((u) => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Save user
    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user info (without password)
    const userInfo = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    console.log(`✅ New user registered: ${newUser.email}`);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: {
        user: userInfo,
        token,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({
      success: false,
      error: "An error occurred during registration.",
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    // Find user
    const user = users.find((u) => u.email === email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user info (without password)
    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    console.log(`✅ User logged in: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        user: userInfo,
        token,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({
      success: false,
      error: "An error occurred during login.",
    });
  }
};

/**
 * Get current user (for token validation)
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = users.find((u) => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("❌ Get user error:", error.message);
    res.status(500).json({
      success: false,
      error: "An error occurred.",
    });
  }
};

module.exports = { register, login, getMe };
