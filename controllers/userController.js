const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// CREATE USER
exports.createUser = async (req, res) => {
try {
const user = await User.create(req.body);
res.status(201).json({ message: "User Created", user });
} catch (error) {
res.status(500).json({ error: error.message });
}
};
// GET ALL USERS
exports.getAllUsers = async (req, res) => {
try {
const users = await User.findAll();
res.status(200).json(users);
} catch (error) {
res.status(500).json({ error: error.message });
}
};

exports.getUserById = async (req, res) => {
    try {
    const user = await User.findByPk(req.params.id);
    if (user) {
    res.status(200).json(user);
} else {
    res.status(404).json({ message: "User Not Found" });
    }
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
    };
// UPDATE USER
exports.updateUser = async (req, res) => {
try {
const user = await User.findByPk(req.params.id);
if (user) {
await user.update(req.body);
res.status(200).json({ message: "User Updated", user });
} else {
res.status(404).json({ message: "User Not Found" });
}
} catch (error) {
res.status(500).json({ error: error.message });
}
};
// DELETE USER
exports.deleteUser = async (req, res) => {
try {
const deleted = await User.destroy({ where: { id: req.params.id } });
if (deleted) {
res.status(200).json({ message: "User Deleted" });
} else {
res.status(404).json({ message: "User Not Found" });
}
} 
catch (error) {
res.status(500).json({ error: error.message });
}
};

exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // Generate JWT token (valid for 1 hour)
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
      res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // Get user by email
exports.getUserByEmail = async (req, res) => {
  try {
      const { email } = req.params;

      const user = await User.findOne({ where: { email } });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
  }
};

