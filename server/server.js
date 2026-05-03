require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const hospitalRoutes = require('./routes/hospitalRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

connectDB();

app.use(cors({
  origin: ['https://medipath-pl3r.onrender.com', 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json()); 

app.use('/api/hospitals', hospitalRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('MediPath Tri-City Backend is Running...');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error',
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Gateway Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/hospitals`);
});
