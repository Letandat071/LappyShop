const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
    async register(userData) {
        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          throw new Error('Email đã được đăng ký');
        }
      
        // Kiểm tra độ dài và độ phức tạp của mật khẩu
        if (userData.password.length < 8) {
          throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
        }
      
        // Tạo user mới
        const newUser = new User({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
          avatar: userData.avatar || "https://imgur.com/Gt3jQsh.jpg" // Sử dụng avatar mặc định nếu không có
        });
      
        // Lưu user mới
        await newUser.save();
        return newUser;
      }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { user, token };
  }

  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }
    return user;
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId);
    if (!user || !(await user.comparePassword(currentPassword))) {
      throw new Error('Mật khẩu hiện tại không đúng');
    }
    user.password = newPassword;
    await user.save();
  }

  async getUserInfo(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }
    return user;
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }
    return user;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Không tìm thấy người dùng với email này');
    }
    const newPassword = '123456';
    user.password = newPassword

    await user.save();

    return user;
  }

  async updateUserAvatar(userId, avatarUrl) {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }
    return user;
  }

  async getAllUsers() {
    console.log('UserService.getAllUsers được gọi');
    const users = await User.find().select('-password');
    console.log('Số lượng users tìm thấy:', users.length);
    return users;
  }
}

module.exports = new UserService();