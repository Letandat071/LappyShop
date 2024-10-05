import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../contexts/DarkModeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authMiddleware from '../../middleware/authMiddleware';

const AdminLogin = () => {
  const { isDarkMode } = useDarkMode();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('AdminToken');
    const role = localStorage.getItem('AdminRole');
    console.log('Token in localStorage:', token);
    console.log('Role in localStorage:', role);
    if (token && role === 'admin') {
      console.log('Token and admin role found in localStorage');
      navigate('/admin');
    } else {
      console.log('No token or admin role found in localStorage');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = { username, password };
    try {
      console.log('Attempting login with:', username);
      const response = await axios.post('http://localhost:3001/api/admin/login', formData, {
        withCredentials: true
      });
      const { token, user } = response.data;
      console.log('Login successful, received token:', token);
      console.log('Received user:', user);

      // Lưu token và role vào localStorage
      localStorage.setItem('AdminToken', token);
      localStorage.setItem('AdminRole', user.role);
      
      console.log('Token and role set in localStorage');
      console.log('Role in localStorage:', localStorage.getItem('AdminRole'));

      if (user.role === 'admin') {
        console.log('Navigating to /admin');
        navigate('/admin');
      } else {
        console.log('Not an admin role:', user.role);
        setError('Tài khoản không có quyền truy cập trang admin.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
      } else {
        setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-10 rounded-xl shadow-2xl`}
      >
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Đăng nhập Admin
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default authMiddleware(AdminLogin);