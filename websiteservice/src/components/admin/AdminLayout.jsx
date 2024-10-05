import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaStore, FaClipboardList, FaMap, FaBars, FaTimes, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useDarkMode } from '../../contexts/DarkModeContext';
import axios from 'axios'; // Thêm dòng này
import config from '../../config';
import Cookies from 'js-cookie';
const AdminLayout = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: FaUsers, text: 'Quản lý User', link: '/admin/users' },
    { icon: FaCalendarAlt, text: 'Quản lý Event', link: '/admin/events' },
    { icon: FaStore, text: 'Quản lý Shop The Sand', link: '/admin/shop' },
    { icon: FaClipboardList, text: 'Quản lý Đơn Order', link: '/admin/orders' },
    { icon: FaMap, text: 'Quản lý Map', link: '/admin/maps' },
    { icon: FaMap, text: 'Quản lý IS', link: '/admin/is' },
  ];

  
 
  const handleLogout = async () => {
    try {
      await axios.post(config.ADMIN_API.LOGOUT, {}, {
        withCredentials: true
      });
      
      // Xóa tất cả cookies
      Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
      });
  
      // Xóa AdminToken và AdminRole
      localStorage.removeItem('AdminToken');
      localStorage.removeItem('AdminRole');
  
      navigate('/admin/login');
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
      
      // Xóa tất cả cookies
      Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
      });
  
      // Xóa AdminToken và AdminRole
      localStorage.removeItem('AdminToken');
      localStorage.removeItem('AdminRole');
  
      navigate('/admin/login');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <nav className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-5 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-2xl">
            <FaTimes />
          </button>
        </div>
        {sidebarItems.map((item, index) => (
          <Link key={index} to={item.link} className="flex items-center p-2 mb-4 rounded hover:bg-gray-700">
            <item.icon className="mr-3" />
            <span>{item.text}</span>
          </Link>
        ))}
        <button onClick={handleLogout} className="flex items-center p-2 mb-4 rounded hover:bg-gray-700 w-full">
          <FaSignOutAlt className="mr-3" />
          <span>Đăng xuất</span>
        </button>
      </nav>

      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
        <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex justify-between items-center`}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl">
            <FaBars />
          </button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={toggleDarkMode} className="text-2xl">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;