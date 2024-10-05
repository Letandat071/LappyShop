import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';
import { FaMoon, FaSun } from 'react-icons/fa';
import { isAuthenticated, getCurrentUser, logout } from '../utils/auth';
import Cookies from 'js-cookie';
import axios from 'axios';
import config from '../config';

const HeaderComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [localAvatar, setLocalAvatar] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      try {
        const token = Cookies.get('UserToken');
        const response = await axios.get(`${config.API_BASE_URL}${config.USER_API.GET_USER_BY_ID}/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserDetails(response.data.data.user);
        // Kiểm tra và sử dụng avatar tạm thời nếu có
        const tempAvatarUrl = localStorage.getItem('tempAvatar');
        if (tempAvatarUrl) {
          setLocalAvatar(tempAvatarUrl);
        } else {
          setLocalAvatar(response.data.data.user.avatar);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin chi tiết người dùng:', error);
      }
    } else {
      setUser(null);
      setUserDetails(null);
      setLocalAvatar(null);
    }
    // Đóng menu người dùng khi trạng thái đăng nhập thay đổi
    setIsUserMenuOpen(false);
  }, []);

  useEffect(() => {
    checkAuth();

    const handleLoginStatusChange = () => {
      checkAuth();
    };

    const handleAvatarUpdate = (event) => {
      if (event.detail) {
        setLocalAvatar(event.detail);
      }
    };

    const handleUserInfoUpdate = (event) => {
      if (event.detail) {
        setUserDetails(prevDetails => ({
          ...prevDetails,
          ...event.detail
        }));
      }
    };

    window.addEventListener('loginStatusChanged', handleLoginStatusChange);
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    window.addEventListener('userInfoUpdated', handleUserInfoUpdate);

    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
      window.removeEventListener('userInfoUpdated', handleUserInfoUpdate);
    };
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setUserDetails(null);
    setLocalAvatar(null);
    setIsUserMenuOpen(false);
    Cookies.remove('UserToken');
    Cookies.remove('user');
    
    // Xóa avatar tạm thời từ localStorage nếu có
    localStorage.removeItem('tempAvatar');
    navigate('/');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <motion.header
      className={`relative bg-gray-900 text-white p-4 shadow-md overflow-hidden`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto relative z-10">
        <div className="flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center">
              <img src="/image/Lapland.png" alt="Lappy Shop Logo" className="h-10 w-10 mr-2" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="text-xl font-bold">Lappy Shop</span>
            </Link>
          </motion.div>

          {/* Large screen navigation */}
          <nav className="hidden md:block flex-grow">
            <ul className="flex justify-center space-x-8">
              {['Trang chủ', 'Dịch vụ của bạn', 'Liên hệ', 'Trang cá nhân'].map((item, index) => (
                <motion.li key={item} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Link 
                    to={item === 'Trang chủ' 
                      ? '/' 
                      : item === 'Dịch vụ của bạn'
                        ? '/dich-vu-cua-ban'
                        : item === 'Liên hệ'
                          ? '/contact'
                          : '/user'
                    } 
                    className="hover:text-yellow-300 transition-colors duration-300 font-medium"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* User menu logic */}
          {user ? (
            <div className="relative">
              <motion.div
                className="flex items-center cursor-pointer"
                onClick={toggleUserMenu}
              >
                <img 
                  src={localAvatar || userDetails?.avatar}
                  alt="User Avatar" 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{userDetails?.fullName}</span>
              </motion.div>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="fixed right-4 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                    style={{
                      zIndex: 9999,
                      top: "60px"
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Link to="/user" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Trang cá nhân</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng xuất</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="hidden md:block hover:text-yellow-300 transition-colors duration-300 font-medium">Đăng nhập</Link>
            </motion.div>
          )}

          <motion.button onClick={toggleDarkMode} className="ml-4" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {isDarkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-600" />}
          </motion.button>

          {/* Small screen menu button */}
          <motion.button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} whileTap={{ scale: 0.9 }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>

        {/* Small screen menu */}
        <motion.nav className={`mt-4 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }} transition={{ duration: 0.3 }}>
          <ul className="flex flex-col space-y-2">
            {['Trang chủ', 'Dịch vụ của bạn', 'Liên hệ', 'Trang cá nhân','Đăng nhập'].map((item, index) => (
              <motion.li key={item} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <Link 
                  to={item === 'Trang chủ' 
                    ? '/' 
                    : item === 'Dịch vụ của bạn'
                      ? '/dich-vu-cua-ban'
                      : item === 'Liên hệ'
                        ? '/contact'
                        : item === 'Trang cá nhân'
                          ? '/user'
                          : '/login'
                  } 
                  className="block hover:text-yellow-300 transition-colors duration-300 font-medium"
                >
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default HeaderComponent;