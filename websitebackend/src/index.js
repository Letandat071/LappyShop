const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const adminRoutes = require('./routes/admin');
const config = require('./config/env');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const TheSandRoutes = require('./routes/TheSand');
const mapRoutes = require('./routes/mapRoutes');
const orderRoutes = require('./routes/orderRoutes');
const ISRoutes = require('./routes/IsRoutes');
dotenv.config();

// Middleware
app.use(cors({
    origin: process.env.API_BASE_URL_CLIENT,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(cors({
//     origin: 'http://localhost:3000', // hoặc URL của frontend của bạn
//     credentials: true
//   }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  
app.use(express.json());  // Chuyển dòng này lên trước các routes
app.use(cookieParser());

// Routes
app.use('/api/is', ISRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/thesand', TheSandRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(config.mongoDb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // console.log(`JWT Secret: ${config.jwtSecret}`);
});