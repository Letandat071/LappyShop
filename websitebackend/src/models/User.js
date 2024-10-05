const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    enum: ['The Sand', 'IS', 'Map', 'Event'] // Các loại dịch vụ có sẵn
  },
  package: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Đang chờ', 'Đang thực hiện', 'Đã hoàn thành'],
    default: 'Đang chờ'
  },
  registerDate: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} không phải là email hợp lệ!`
    }
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
  },
  avatar: {
    type: String,
    default: "https://imgur.com/Gt3jQsh.jpg"
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  registeredServices: [serviceSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Phương thức để so sánh mật khẩu
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware để mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;