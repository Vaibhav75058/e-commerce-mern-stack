const User = require('../models/User');
const jwt = require('jsonwebtoken');

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const emailQuery = { $regex: new RegExp('^' + escapeRegex(email.trim()) + '$', 'i') };
    const userExists = await User.findOne({ email: emailQuery });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const emailQuery = { $regex: new RegExp('^' + escapeRegex(email.trim()) + '$', 'i') };
    const user = await User.findOne({ email: emailQuery });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const emailQuery = { $regex: new RegExp('^' + escapeRegex(email.trim()) + '$', 'i') };
    const user = await User.findOne({ email: emailQuery });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate a random 4-digit code (simulated OTP)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP in user document with 15 minutes expiry
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    console.log(`[FORGOT PASSWORD OTP] User: ${email} -> OTP: ${otp}`);

    // In a real app we'd send email here.
    // For development/demo purposes we will log it and return it in JSON so they can use it immediately.
    return res.json({
      message: 'OTP sent to your registered email (Simulated)',
      otp: otp, // Returning for ease of testing in front-end
    });
  } catch (error) {
    console.error('ForgotPassword error:', error);
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const emailQuery = { $regex: new RegExp('^' + escapeRegex(email.trim()) + '$', 'i') };
    const user = await User.findOne({
      email: emailQuery,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOTP = "";
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    return res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('ResetPassword error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };