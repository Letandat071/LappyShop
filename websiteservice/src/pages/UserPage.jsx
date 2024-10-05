import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';
import { FaUser, FaLock, FaClipboardList, FaTimes, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logout, isAuthenticated, getCurrentUser } from '../utils/auth';
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../config';

// Tạo một instance axios với baseURL
const api = axios.create({
  baseURL: config.API_BASE_URL, // Đảm bảo rằng bạn đã định nghĩa API_BASE_URL trong file config
});

const UserPage = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [services, setServices] = useState([]);
  const [avatarLinks, setAvatarLinks] = useState([]);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [localAvatar, setLocalAvatar] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUserInfo(currentUser); 
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

          // Lấy danh sách dịch vụ của người dùng
          const servicesResponse = await axios.get(`${config.API_BASE_URL}/orders/user/${currentUser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          // console.log('Dịch vụ nhận được:', servicesResponse.data); // Thêm log này
          setServices(servicesResponse.data);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin chi tiết người dùng hoặc dịch vụ:', error);
        }
        setIsLoading(false);
      } else {
        navigate('/login');
      }
    };
    checkAuth();
    fetchAvatarLinks();
  }, [navigate]);


 

  // Lấy danh sách avatar từ file text
  const fetchAvatarLinks = () => {
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
  };

  // Cập nhật thông tin người dùng
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const updatedFields = {
        fullName: userInfo.fullName,
        email: userInfo.email
      };

      const response = await api.put(config.USER_API.UPDATE, updatedFields, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('UserToken')}`
        }
      });
      
      // console.log('API Response:', response);

      if (response.data && response.data.status === 'success') {
        // Cập nhật cả userInfo và userDetails
        const updatedUser = { ...userInfo, ...updatedFields };
        setUserInfo(updatedUser);
        setUserDetails(prevDetails => ({
          ...prevDetails,
          ...updatedFields
        }));
        
        // Cập nhật localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Kích hoạt sự kiện cập nhật thông tin người dùng
        const event = new CustomEvent('userInfoUpdated', { detail: updatedUser });
        window.dispatchEvent(event);

        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          text: 'Thông tin của bạn đã được cập nhật',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
          },
          buttonsStyling: false
        });
      } else {
        throw new Error(response.data?.message || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      let errorMessage = 'Không thể cập nhật thông tin. Vui lòng thử lại sau.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: errorMessage,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        },
        buttonsStyling: false
      });
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    try {
      const response = await api.put(
        config.USER_API.CHANGE_PASSWORD,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('UserToken')}`
          }
        }
      );

      if (response.data && response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Mật khẩu của bạn đã được cập nhật',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
          },
          buttonsStyling: false
        });
        // Reset form sau khi đổi mật khẩu thành công
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } else {
        throw new Error(response.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      
      let errorMessage = 'Không thể đổi mật khẩu. Vui lòng thử lại sau.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    }
  };

  // Huỷ dịch vụ
  const handleCancelService = async (serviceId) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận hủy dịch vụ',
        text: "Bạn có chắc chắn muốn hủy dịch vụ này không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ'
      });

      if (result.isConfirmed) {
        // console.log('Đang hủy dịch vụ với ID:', serviceId);
        if (!serviceId) {
          throw new Error('ID dịch vụ không hợp lệ');
        }
        const token = Cookies.get('UserToken');
        await api.delete(`/orders/delete/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Cập nhật danh sách dịch vụ sau khi hủy
        const updatedServices = services.filter(service => service._id !== serviceId);
        setServices(updatedServices);

        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Dịch vụ đã được hủy',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
          },
          buttonsStyling: false
        });
      }
    } catch (error) {
      console.error('Lỗi khi hủy dịch vụ:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || 'Không thể hủy dịch vụ. Vui lòng thử lại sau.',
        confirmButtonText: 'OK'
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('vi-VN', options);
  };
  
  const handleAvatarSelect = async (avatarUrl) => {
    try {
      // console.log('Selected avatar URL:', avatarUrl);
      const response = await api.put(
        config.USER_API.UPDATE_AVATAR, // Đây là API cập nhật avatar
        { avatar: avatarUrl },
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('UserToken')}`
          }
        }
      );
  
      if (response.data && response.data.status === 'success') {
        // Cập nhật state và localStorage
        setUserInfo(prevState => ({
          ...prevState,
          avatar: avatarUrl
        }));
        const updatedUser = { ...userInfo, avatar: avatarUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Cập nhật avatar tạm thời
        setLocalAvatar(avatarUrl);
        localStorage.setItem('tempAvatar', avatarUrl);
        
        // Tạo và dispatch một custom event
        const event = new CustomEvent('avatarUpdated', { detail: avatarUrl });
        window.dispatchEvent(event);
        
        setShowAvatarPopup(false);
  
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          text: 'Avatar của bạn đã được cập nhật',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
          },
          buttonsStyling: false
        });
      } else {
        throw new Error(response.data?.message || 'Có lỗi xảy ra khi cập nhật avatar');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật avatar:', error);
  
      let errorMessage = 'Không thể cập nhật avatar. Vui lòng thử lại sau.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else {
        errorMessage = error.message;
      }
  
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: errorMessage,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        },
        buttonsStyling: false
      });
    }
  };
  // console.log(userDetails?.avatar)
  
  // Đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Đang tải thông tin...</p>
    </div>;
  }

  if (!userInfo) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</p>
    </div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Trang cá nhân</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
          Đăng xuất
        </button>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/4 px-4 mb-8">
            <motion.div
              className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative group">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={localAvatar || userDetails?.avatar}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full mx-auto mb-4 transition-all duration-300 group-hover:opacity-75"
                  />
                  <div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => setShowAvatarPopup(true)}
                  >
                    <FaCamera className="text-white text-3xl" />
                  </div>
                </motion.div>
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">{userDetails?.fullName}</h2>
              <p className="text-center text-gray-500">{userDetails?.email}</p>
            </motion.div>
          </div>
          <div className="w-full md:w-3/4 px-4">
            <motion.div
              className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex mb-6">
                <button
                  className={`mr-4 pb-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser className="inline-block mr-2" />
                  Thông tin cá nhân
                </button>
                <button
                  className={`mr-4 pb-2 ${activeTab === 'password' ? 'border-b-2 border-blue-500' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  <FaLock className="inline-block mr-2" />
                  Đổi mật khẩu
                </button>
                <button
                  className={`pb-2 ${activeTab === 'services' ? 'border-b-2 border-blue-500' : ''}`}
                  onClick={() => setActiveTab('services')}
                >
                  <FaClipboardList className="inline-block mr-2" />
                  Dịch vụ của bạn
                </button>
              </div>
              {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Họ và tên</label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}
                      value={userInfo.fullName}
                      onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    />
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">Cập nhật thông tin</button>
                </form>
              )}
              {activeTab === 'password' && (
                <form onSubmit={handleChangePassword}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Mật khẩu mới</label>
                    <input
                      type="password"
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Nhập lại mật khẩu mới</label>
                    <input
                      type="password"
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}
                      value={passwordData.confirmNewPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                    />
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">Đổi mật khẩu</button>
                </form>
              )}
              {activeTab === 'services' && (
                <div>
                  {services.length > 0 ? (
                    <div className="space-y-4">
                      {services.map(service => (
                        <motion.div
                          key={service._id}
                          className={`p-4 rounded-lg shadow-md ${
                            isDarkMode ? 'bg-gray-700' : 'bg-white'
                          } ${
                            service.status === 'Xong' ? 'opacity-50' : ''
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{service.serviceName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              service.status === 'Đang chờ' ? 'bg-yellow-200 text-yellow-800' :
                              service.status === 'Đang thực hiện' ? 'bg-blue-200 text-blue-800' :
                              service.status === 'Xong' ? 'bg-green-200 text-green-800' :
                              'bg-red-200 text-red-800'
                            }`}>
                              {service.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">Giá: {service.price}K</p>
                          <p className="text-sm text-gray-500">Chi tiết: {service.serviceDetails}</p>
                          <p className="text-sm text-gray-500">Ngày đặt: {formatDate(service.createdAt)}</p>
                          {service.status !== 'Đã hủy' && service.status !== 'Xong' && (
                            <button 
                              onClick={() => handleCancelService(service._id)} 
                              className="mt-3 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                            >
                              Hủy dịch vụ
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Bạn chưa đăng ký dịch vụ nào.</p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
};

export default UserPage;