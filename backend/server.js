const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rakeshkumar_jewellers";

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "An account with this email is already registered!" });
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password
    });

    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: "Server error during registration" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    // Query both email and password for secure authentication
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      password: password
    });

    if (!user) {
      return res.json({ success: false, error: "Invalid email or password" });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Server error during login" });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
