import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { carRoutes } from './routes/carRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import serverless from 'serverless-http';

const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

// Debug middleware
app.use((req, res, next) => {
  console.log('Request received:', {
    method: req.method,
    path: req.path,
    body: req.body
  });
  next();
});

// Mount routes directly (no additional nesting)
app.use('/users', userRoutes);
app.use('/cars', carRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: err.message });
});

// Export the handler
export const handler = serverless(app);

