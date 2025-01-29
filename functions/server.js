import express from "express"
import serverless from "serverless-http"
import mongoose from "mongoose"
import cors from "cors"
import { carRoutes } from "./routes/carRoutes.js"
import { userRoutes } from "./routes/userRoutes.js"

const app = express()

// Detailed request logging
app.use((req, res, next) => {
  console.log("Incoming request:", {
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

// MongoDB connection
console.log("Connecting to MongoDB...")
try {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected Successfully")
} catch (error) {
  console.error("MongoDB Connection Error:", error)
}

// Health check endpoint
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

// Error handling
app.use((err, req, res, next) => {
  console.error("Server Error:", {
    path: req.path,
    error: err.message,
    stack: err.stack,
  })
  res.status(500).json({
    message: err.message || "Internal server error",
    path: req.path,
  })
})

// Export handler with proper configuration
export const handler = serverless(app, {
  basePath: "/.netlify/functions/server",
})

