const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const { carRoutes } = require('./routes/carRoutes');
const { userRoutes } = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Verify the MongoDB URI is loaded correctly
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);


module.exports.handler = serverless(app);
