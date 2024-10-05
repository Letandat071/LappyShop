const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist'); // Thêm dòng này
const { authMiddleware, checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth'); // Thêm dòng này
const config = require('../config/env');



router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        
        const token = jwt.sign(
            { id: admin._id, role: admin.role }, 
            config.jwtSecret, 
            { expiresIn: '1h' }
        );
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng HTTPS trong production
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });
        console.log('Token set in cookie:', token); // Thêm dòng này để kiểm tra
        res.json({ 
            token, 
            user: { id: admin._id, username: admin.username, role: admin.role }, // Thêm role vào đây
            message: 'Login successful', 
            redirectUrl: '/admin' 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        const blacklist = new Blacklist({ token });
        await blacklist.save();
        res.clearCookie('token');
        res.json({ message: 'Logout successful', redirectUrl: '/api/admin/login' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// router.post('/login', async (req, res) => {
//     try {
//       const { username, password } = req.body;
//       const admin = await Admin.findOne({ username });
      
//       if (!admin) {
//         return res.status(401).json({ message: 'Authentication failed' });
//       }
      
//       const isMatch = await bcrypt.compare(password, admin.password);
      
//       if (!isMatch) {
//         return res.status(401).json({ message: 'Authentication failed' });
//       }
      
//       const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       console.log('Login successful, token:', token); // Thêm dòng này để kiểm tra token
//       res.json({ token });
//     } catch (error) {
//       console.error('Login error:', error); // Thêm dòng này để kiểm tra lỗi
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  

// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         let admin = await Admin.findOne({ username });

//         if (admin) {
//             return res.status(400).json({ message: 'Admin already exists' });
//         }

//         admin = new Admin({ username, password });
//         await admin.save();

//         res.status(201).json({ message: 'Admin registered successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// router.post('/logout', async (req, res) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const blacklist = new Blacklist({ token });
//     await blacklist.save();
//     res.json({ message: 'Logout successful' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });



router.get('/check-auth', authMiddleware, (req, res) => {
    res.json({ message: 'Authenticated', user: req.user });
});

router.get('/', authMiddleware, (req, res) => {
    res.json({ message: 'Admin dashboard', user: req.user });
});



module.exports = router;