const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  console.log('isAdmin middleware được gọi');
  console.log('User:', req.user);
  if (req.user && req.user.role === 'admin') {
    console.log('User là admin');
    next();
  } else {
    console.log('User không phải là admin');
    res.status(403).json({
      status: 'fail',
      message: 'Bạn không có quyền truy cập'
    });
  }
};

// Đảm bảo route này được định nghĩa


router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/update', authMiddleware, UserController.updateUser);
router.post('/logout', authMiddleware, UserController.logout);
router.put('/change-password', authMiddleware, UserController.changePassword);
router.get('/me', authMiddleware, UserController.getUserInfo);

// Thêm routes mới
router.get('/getuser/:userId', authMiddleware, UserController.getUserById);
router.post('/forgot-password', UserController.forgotPassword);
router.put('/update-avatar', authMiddleware, UserController.updateUserAvatar);

// Thêm route mới này
router.get('/all', authMiddleware, isAdmin, UserController.getAllUsers);

module.exports = router;