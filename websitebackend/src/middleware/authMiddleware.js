const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Giả sử bạn có một model Admin riêng
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  console.log('authMiddleware được gọi');
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token:', token);

    if (!token) {
      console.log('Không có token');
      return res.status(401).json({ message: 'Không có token xác thực' });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    let user;
    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id);
    } else {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      console.log('User/Admin không tồn tại trong database');
      return res.status(404).json({ message: "User/Admin không tồn tại" });
    }

    // Gán user vào request
    req.user = user;
    console.log('User/Admin tìm thấy:', user);
    next();
  } catch (error) {
    console.error('Lỗi trong authMiddleware:', error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = authMiddleware;