const express = require("express")
const jwt = require("jsonwebtoken")
const { User } = require("../models/User.js")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    console.log("Register request received:", {
      body: req.body,
      headers: req.headers,
    })

    const { email, password, isAdmin } = req.body

    if (!email || !password) {
      console.log("Missing required fields")
      return res.status(400).json({ message: "Email and password are required" })
    }

    let user = await User.findOne({ email })
    if (user) {
      console.log("User already exists:", email)
      return res.status(400).json({ message: "User already exists" })
    }

    user = new User({ email, password, isAdmin })
    await user.save()
    console.log("New user created:", email)

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.status(201).json({ token, isAdmin: user.isAdmin })
  } catch (error) {
    console.error("Registration error:", {
      error: error.message,
      stack: error.stack,
    })
    res.status(500).json({ message: "Registration failed", error: error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body)
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      console.log("Invalid login attempt for:", email)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "24h" })

    console.log("Successful login for:", email)
    res.json({ token, isAdmin: user.isAdmin })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Login failed", error: error.message })
  }
})

module.exports = { userRoutes: router }

