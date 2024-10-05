import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import axios from 'axios';
import config from '../config';

const ForgotPassword = () => {
  const { isDarkMode } = useDarkMode();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(config.USER_API.FORGOT_PASSWORD, { email });
      console.log(response);
      setIsSuccess(true);
      setMessage('Yêu cầu đặt lại mật khẩu thành công. Mật khẩu mới của bạn là: 123456');
    } catch (error) {
      setIsSuccess(false);
      setMessage('Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.');
    }
  };

  return (
    <div className="app-background">
      <div className="app-overlay">
        <div className="content-wrapper">
          <motion.div 
            className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} p-10 rounded-xl shadow-2xl`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Quên mật khẩu
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn"
                />
              </div>

              <div>
                <motion.button
                  type="submit"
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Gửi yêu cầu đặt lại mật khẩu
                </motion.button>
                <div className="text-sm mt-3 text-center">
                  <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400">
                    Quay lại đăng nhập
                  </Link>
                </div>
              </div>
              {message && (
                <div className={`mt-3 text-sm text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;