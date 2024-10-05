const jwt = require('jsonwebtoken');
const config = require('../config/env');
const Blacklist = require('../models/Blacklist'); // Thêm dòng này
const Admin = require('../models/Admin');
const User = require('../models/User');

function generateToken(user) {
    return jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (ex) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
  }

  async function isTokenBlacklisted(token) {
    const blacklistedToken = await Blacklist.findOne({ token });
    return !!blacklistedToken;
}

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided', redirectUrl: '/login' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Kiểm tra xem người dùng có phải là admin không
        let user;
        if (decoded.role === 'admin') {
            user = await Admin.findById(decoded.id);
        } else {
            user = await User.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found', redirectUrl: '/login' });
        }

        // Kiểm tra quyền truy cập admin
        if (req.originalUrl.startsWith('/api/admin') && user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin rights required.', redirectUrl: '/' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token', redirectUrl: '/login' });
    }
};

// const checkAuthenticated = (req, res, next) => {
//     const token = req.cookies.token || req.headers['authorization'];

//     if (!token) {
//         return res.redirect('/admin/login');
//     } 

//     jwt.verify(token, 'your_secret_key', (err, user) => {
//         if (err) {
//             return res.redirect('/admin/login');
//         }

//         req.user = user;
//         next();
//     });
// };

// module.exports = {
//     generateToken,
//     verifyToken,
//     authMiddleware,
//     checkAuthenticated
// };

const checkAuthenticated = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    } 

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        req.user = decoded;
        next();
    });
};

const checkNotAuthenticated = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return next();
    }

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) {
            return next();
        }

        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
            return next();
        }

        // User is authenticated, redirect to admin page
        return res.status(302).json({ message: 'Already authenticated', redirectUrl: '/api/admin' });
    });
};

module.exports = {
    generateToken,
    verifyToken,
    authMiddleware,
    checkAuthenticated,
    checkNotAuthenticated
};