import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import authMiddleware from '../../middleware/authMiddleware';
import config from '../../config';
import { FaUser, FaEnvelope, FaClock, FaIdCard } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('AdminToken') || localStorage.getItem('AdminToken');
      console.log('Token from client:', token); // Debug: Log token

      // Debug: Log decoded token (if possible)
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded token:', decodedToken);
      } catch (e) {
        console.log('Unable to decode token');
      }

      console.log('API URL:', config.ADMIN_API.GET_ALL_USERS);
      
      const response = await axios.get(config.ADMIN_API.GET_ALL_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response:', response.data);
      setUsers(response.data.data.users);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || 'Không thể tải danh sách người dùng');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('vi-VN', options);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Danh sách người dùng</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {users.map(user => (
          <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={user.avatar || 'https://via.placeholder.com/100'}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-2">{user.fullName}</h3>
              <div className="flex items-center mb-2">
                <FaEnvelope className="text-gray-500 mr-2" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="text-gray-500 mr-2" />
                <span className="text-gray-600">
                  Tạo lúc: {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
            <div className="p-4 flex items-center">
              <button 
                onClick={() => handleViewDetails(user)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Thông tin chi tiết</h3>
            <img
              src={selectedUser.avatar || 'https://via.placeholder.com/100'}
              alt={selectedUser.fullName}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <div className="space-y-2">
              <p><FaUser className="inline mr-2" /> {selectedUser.fullName}</p>
              <p><FaEnvelope className="inline mr-2" /> {selectedUser.email}</p>
              <p><FaIdCard className="inline mr-2" /> {selectedUser.role}</p>
              <p><FaClock className="inline mr-2" /> Tạo lúc: {formatDate(selectedUser.createdAt)}</p>
              <p><FaClock className="inline mr-2" /> Cập nhật lúc: {formatDate(selectedUser.updatedAt)}</p>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default authMiddleware(UserManagement);