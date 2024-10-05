  import React, { useState, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import { Link, useNavigate } from 'react-router-dom';
  import { useDarkMode } from '../contexts/DarkModeContext';
  import { login, isAuthenticated } from '../utils/auth'; // Thêm isAuthenticated vào đây
  import Swal from 'sweetalert2';
  import Cookies from 'js-cookie';

  const Login = () => {
    const { isDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      if (isAuthenticated()) {
        navigate('/user');
      }
    }, [navigate]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        const response = await login(formData.email, formData.password);
        if (rememberMe) {
          // Lưu thông tin người dùng vào cookies
          Cookies.set('user', JSON.stringify(response.data.data.user), { expires: 7 });
        }
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: 'Bạn sẽ được chuyển hướng đến trang chủ.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/');
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: 'Vui lòng kiểm tra lại email và mật khẩu.',
        });
      }
    };

    const handleForgotPassword = () => {
      navigate('/forgot-password');
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
                  Đăng nhập
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
                    value={formData.email}
                    onChange={handleInputChange}
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
                    autoComplete="current-password"
                    required
                    className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className={`h-4 w-4 ${isDarkMode ? 'text-blue-600 focus:ring-blue-500 border-gray-600' : 'text-gray-600 focus:ring-gray-500 border-gray-300'} rounded`}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember-me" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <div className="text-sm">
                    <button 
                      type="button" // Thay đổi type thành "button"
                      onClick={handleForgotPassword}
                      className="font-medium text-blue-500 hover:text-blue-400 bg-transparent border-none cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                </div>

                <div>
                  <motion.button
                    type="submit"
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Đăng nhập
                  </motion.button>
                  <div className="text-sm mt-3 text-center">
                    <Link to="/register" className="font-medium text-blue-500 hover:text-blue-400">
                      Chưa có tài khoản? Đăng ký
                    </Link>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  export default Login;