const express = require("express")
const serverless = require("serverless-http")
const mongoose = require("mongoose")
const cors = require("cors")
const { carRoutes } = require("./routes/carRoutes.js")
const { userRoutes } = require("./routes/userRoutes.js")

const app = express()

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log("Request received:", {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers,
    url: req.url,
  })
  next()
})

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use(express.json())

// MongoDB connection with enhanced error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully")
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err)
  })

// Basic test route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    mongoDbStatus: mongoose.connection.readyState,
  })
})

// Mount routes
app.use("/users", userRoutes)
app.use("/cars", carRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err)
  res.status(500).json({
    message: err.message || "Internal server error",
    path: req.path,
  })
})

module.exports.handler = serverless(app)

