import express from "express"
import serverless from "serverless-http"
import mongoose from "mongoose"
import cors from "cors"
import { carRoutes } from "./routes/carRoutes.js"
import { userRoutes } from "./routes/userRoutes.js"

const app = express()

// Debug logging
app.use((req, res, next) => {
  console.log("Request received:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
  })
  next()
})

// CORS and JSON parsing
app.use(cors())
app.use(express.json())

// MongoDB connection with detailed logging
console.log("Attempting MongoDB connection...")
try {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB connected successfully")
} catch (error) {
  console.error("MongoDB connection failed:", error.message)
}

// Basic test route at the root
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    mongoDbStatus: mongoose.connection.readyState,
  })
})

// Test route
app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "Test endpoint reached",
    mongoDbStatus: mongoose.connection.readyState,
  })
})

// Mount routes
app.use("/users", userRoutes)
app.use("/cars", carRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error("Server Error:", err)
  res.status(500).json({
    message: err.message || "Internal server error",
    path: req.path,
  })
})

// Export the handler with path stripping
export const handler = serverless(app, {
  basePath: "/.netlify/functions/server",
})

