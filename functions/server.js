import express from 'express';
import { createHandler } from './utils/handler.js';
import mongoose from 'mongoose';
import cors from 'cors';
import { carRoutes } from './routes/carRoutes.js';
import { userRoutes } from './routes/userRoutes.js';

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/users', userRoutes);
app.use('/cars', carRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Export the handler
export const handler = createHandler(app);

