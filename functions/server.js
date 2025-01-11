import express from 'express';
import { createHandler } from './utils/handler.js';
import mongoose from 'mongoose';
import cors from 'cors';
import { carRoutes } from './routes/carRoutes.js';
import { userRoutes } from './routes/userRoutes.js';

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
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Base API path
const apiRouter = express.Router();
apiRouter.use('/cars', carRoutes);
apiRouter.use('/users', userRoutes);

// Mount API router at the Netlify function path
app.use('/.netlify/functions/api', apiRouter);

// API health check endpoint
app.get('/.netlify/functions/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Export the handler
export const handler = createHandler(app);

