const express = require("express")
const serverless = require("serverless-http")
const mongoose = require("mongoose")
const cors = require("cors")
const { carRoutes } = require("./routes/carRoutes.js")
const { userRoutes } = require("./routes/userRoutes.js")

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
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.error("MongoDB Connection Error:", error))

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
module.exports.handler = serverless(app)

