const UserService = require('../services/UserService');

class UserController {
    async register(req, res) {
        console.log('Request body:', req.body);  // Log để debug
        try {
          const { fullName, email, password, confirmPassword, avatar } = req.body;
          
          // Kiểm tra xem các trường bắt buộc có được cung cấp không
          if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({
              status: 'fail',
              message: 'Vui lòng cung cấp đầy đủ thông tin: fullName, email, password, confirmPassword'
            });
          }
      
          // Kiểm tra mật khẩu và xác nhận mật khẩu
          if (password !== confirmPassword) {
            return res.status(400).json({
              status: 'fail',
              message: 'Mật khẩu và xác nhận mật khẩu không khớp'
            });
          }
      
          const user = await UserService.register({ fullName, email, password, avatar });
          res.status(201).json({
            status: 'success',
            data: {
              user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                avatar: user.avatar
              }
            }
          });
        } catch (error) {
          console.error('Registration error:', error);  // Log lỗi để debug
          if (error.message === 'Email đã được đăng ký') {
            return res.status(409).json({
              status: 'fail',
              message: error.message
            });
          }
          res.status(400).json({
            status: 'fail',
            message: error.message || 'Có lỗi xảy ra trong quá trình đăng ký'
          });
        }
      }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await UserService.login(email, password);
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      res.status(401).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.user.id, req.body);
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          }
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  logout(req, res) {
    // Đăng xuất được xử lý ở phía client bằng cách xóa token
    res.status(200).json({
      status: 'success',
      message: 'Đăng xuất thành công'
    });
  }

  async changePassword(req, res) {
    try {
      await UserService.changePassword(req.user.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Đổi mật khẩu thành công'
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  async getUserInfo(req, res) {
    try {
      const user = await UserService.getUserInfo(req.user.id);
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.userId);
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          status: 'fail',
          message: 'Vui lòng cung cấp địa chỉ email'
        });
      }

      await UserService.forgotPassword(email);
      
      res.status(200).json({
        status: 'success',
        message: 'Mật khẩu đã được reset. Vui lòng kiểm tra email của bạn.'
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  async updateUserAvatar(req, res) {
    try {
      // console.log('Received request to update avatar for user:', req.user.id);
      // console.log('New avatar URL:', req.body.avatar);
  
      const user = await UserService.updateUserAvatar(req.user.id, req.body.avatar);
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            avatar: user.avatar
          }
        }
      });
    } catch (error) {
      console.error('Error in updateUserAvatar:', error);
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        status: 'success',
        data: { users }
      });
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        message: 'Có lỗi xảy ra khi lấy danh sách người dùng'
      });
    }
  }
}

module.exports = new UserController();