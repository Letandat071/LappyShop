import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import Swal from 'sweetalert2';
import config from '../config';

const Regist = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [avatarLinks, setAvatarLinks] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("https://imgur.com/Gt3jQsh.jpg");
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetch('/listAvatar.txt')
      .then(response => response.text())
      .then(text => {
        const links = text
          .split(',')
          .map(link => link.trim().replace(/"/g, ''))
          .filter(link => link);
        setAvatarLinks(links);
      })
      .catch(error => console.error('Error loading avatar links:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setShowAvatarPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mật khẩu xác nhận không khớp',
      });
      return;
    }
  
    const registrationData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      avatar: selectedAvatar
    };
  
    console.log('Sending registration data:', registrationData); // Thêm log này
  
    try {
      const response = await fetch(config.USER_API.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
  
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
        text: 'Bạn sẽ được chuyển hướng đến trang đăng nhập',
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error('Error during registration:', error);
      Swal.fire({
        icon: 'error',
        title: 'Đăng ký thất bại',
        text: error.message || 'Vui lòng thử lại.',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="app-background">
      <div className="app-overlay">
        <div className="content-wrapper">
          <motion.div 
            className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-10 rounded-xl shadow-2xl`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Đăng ký tài khoản
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={selectedAvatar}
                    alt="Selected Avatar"
                    className="w-32 h-32 rounded-full border-4 border-gray-300 transition-all duration-300 group-hover:opacity-75"
                  />
                  <div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => setShowAvatarPopup(true)}
                  >
                    <FaCamera className="text-white text-3xl" />
                  </div>
                </motion.div>
                <p className="mt-2 text-sm text-gray-500">Nhấn vào ảnh để thay đổi avatar</p>
              </div>

              <div>
                <label htmlFor="fullName" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Họ Tên
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm pr-10`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm pr-10`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div>
                <motion.button
                  type="submit"
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-800 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng ký
                </motion.button>
                <div className="text-sm mt-3 text-center">
                  <Link to="/login" className={`font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                    Đã có tài khoản? Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </motion.div>

          {showAvatarPopup && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto relative`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <motion.button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAvatarPopup(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-xl" />
                </motion.button>
                <h3 className="text-lg font-medium mb-2">Chọn Avatar</h3>
                <div className="text-sm text-red-500 mt-4 mb-4 text-center">
                  <p>Lưu ý: Các Avatar hiện tại chỉ là thử nghiệm</p>
                  <p>Toàn bộ hệ thống sẽ được thay thế sớm</p>
                  <p>Bản quyền thuộc về <a href="https://www.pixiv.net/en/users/6657532" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@QuAn_</a></p>
                </div>
                <div className="grid grid-cols-6 gap-4 mb-4">
                  {avatarLinks.map((avatarUrl, index) => (
                    <motion.img
                      key={index}
                      src={avatarUrl}
                      alt={`Avatar ${index + 1}`}
                      className="w-12 h-12 rounded-full cursor-pointer"
                      onClick={() => handleAvatarSelect(avatarUrl)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Regist;