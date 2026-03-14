const { User } = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
dotenv.config();
const logger = require('../utils/logger');

const getlist = async (req, res) => {
    try {
        const data = await User.findAll();
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        logger("Error fetching user list: ", error,res);
    }
};

const getone = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json({
                success: true,
                data: user
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
    } catch (error) {
        logger("Error fetching user details: ", error,res);
    }
};

const create = async (req, res) => {
  try {
    const { username, email, password, status } = req.body;

    // validate email
    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    // validate password
    if (!password || typeof password !== "string" || password.length < 3) {
      return res.status(400).json({
        success: false,
        error: "Password is required and must be at least 3 characters",
      });
    }

    // check duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword, // store hashed
      status,
    });

    // hide password from response
    const safeUser = { ...newUser.toJSON() };
    delete safeUser.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: safeUser,
    });
  } catch (error) {
    logger("Error creating user:", error, res);
  }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate email
        if (!email || typeof email !== "string") {
            return res.status(400).json({ success: false, error: "Email is required" });
        }

        // validate password
        if (!password || typeof password !== "string" || password.length < 3) {
            return res.status(400).json({
                success: false,
                error: "Password is required and must be at least 3 characters",
            });
        }

        // check user credentials
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // hide password from response
        const safeUser = { ...user.toJSON() };
        delete safeUser.password;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });
    } catch (error) {
        logger("Error logging in user:", error, res);
    }
};

const update = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const { username, email, password, status } = req.body;

        // validate email
        if (email && typeof email !== "string") {
            return res.status(400).json({ success: false, error: "Invalid email format" });
        }

        // validate password
        if (password && (typeof password !== "string" || password.length < 3)) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 3 characters",
            });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

        // update user
        await user.update({
            username,
            email,
            password: hashedPassword,
            status
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        logger("Error updating user:", error, res);
    }
};

const Delete = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        await user.destroy();

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        logger("Error deleting user:", error, res);
    }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const emailTrim = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: emailTrim } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // ✅ generate 6 digit OTP (string)
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // ✅ save plain OTP
    await user.update({
      otp_code: otp,
      otp_expires_at: expiresAt,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: "Email and OTP required" });
    }

    const emailTrim = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: emailTrim } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (!user.otp_code || !user.otp_expires_at) {
      return res.status(400).json({ success: false, error: "OTP not requested" });
    }

    // ✅ check expiry
    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ success: false, error: "OTP expired" });
    }

    // ✅ compare directly
    if (String(user.otp_code) !== String(otp)) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const emailTrim = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: emailTrim } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (String(user.otp_code) !== String(otp)) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ success: false, error: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      otp_code: null,
      otp_expires_at: null,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
    getlist,
    getone,
    create,
    login,
    update,
    Delete,
    sendOTP,
    verifyOTP,
    resetPassword
};