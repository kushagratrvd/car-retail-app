const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const { carRoutes } = require('./routes/carRoutes');
const { userRoutes } = require('./routes/userRoutes');

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

// Remove the /.netlify/functions/api prefix from routes
app.use('/users', userRoutes);
app.use('/cars', carRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Export the serverless handler
module.exports.handler = serverless(app);

