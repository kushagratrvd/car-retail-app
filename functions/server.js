import express from "express"
import serverless from "serverless-http"
import mongoose from "mongoose"
import cors from "cors"
import { carRoutes } from "./routes/carRoutes.js"
import { userRoutes } from "./routes/userRoutes.js"

const app = express()

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log("Request received:", {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers,
  })
  next()
})

app.use(cors())
app.use(express.json())

// Connect to MongoDB with enhanced logging
console.log("Attempting to connect to MongoDB...")
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas")
    // Log the connection status
    console.log("MongoDB connection state:", mongoose.connection.readyState)
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB. Error:", err)
    // Log more details about the connection attempt
    console.error("MongoDB URI:", process.env.MONGODB_URI ? "Set" : "Not set")
    console.error("MongoDB connection state:", mongoose.connection.readyState)
  })

// Test endpoint that includes MongoDB connection status
app.get("/test", (req, res) => {
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

export const handler = serverless(app)

