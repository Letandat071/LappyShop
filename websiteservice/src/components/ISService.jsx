import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';
import axios from 'axios';
import config from '../config';
import { getCurrentUser } from '../utils/auth';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const ISCard = ({ name, imageUrl, isSelected, onClick }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <motion.div 
      className={`cursor-pointer ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md p-4 flex items-center ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={name} 
          className={`w-full h-full object-cover transition-all duration-300 ${isSelected ? '' : 'grayscale'}`}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Mode dành cho Oldbie, Newbie cân nhắc</p>
      </div>
    </motion.div>
  );
};

const ISContent = ({ name, imageUrl, startlevel, endlevel }) => {
  const { isDarkMode } = useDarkMode();
  const [userStartLevel, setUserStartLevel] = useState('');
  const [userEndLevel, setUserEndLevel] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [savedAmount, setSavedAmount] = useState(0);
  const [startLevelError, setStartLevelError] = useState('');
  const [endLevelError, setEndLevelError] = useState('');
  const [user, setUser] = useState(null);
  const [existingOrder, setExistingOrder] = useState(null);

  useEffect(() => {
    calculatePrice();
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser && currentUser.id) {
      checkExistingOrder(currentUser.id);
    }
  }, [userStartLevel, userEndLevel]);

  const calculatePrice = () => {
    const start = parseInt(userStartLevel, 10);
    const end = parseInt(userEndLevel, 10);

    if (!isNaN(start) && !isNaN(end) && start < end) {
      let price = 0;
      let discountableLevels = 0;

      for (let i = start; i < end; i++) {
        if (i <= 34) {
          price += 2;
        } else {
          price += 4;
          discountableLevels++;
        }
      }

      const originalPrice = price;
      const discountedSets = Math.floor(discountableLevels / 50);
      const discount = discountedSets * 30;
      price -= discount;

      setTotalPrice(price);
      setSavedAmount(discount);
    } else {
      setTotalPrice(0);
      setSavedAmount(0);
    }
  };

  const handleStartLevelChange = (e) => {
    const value = e.target.value;
    setUserStartLevel(value);
    if (value !== '' && (parseInt(value) < startlevel || parseInt(value) >= endlevel)) {
      setStartLevelError(`Level bắt đầu phải từ ${startlevel} đến ${endlevel - 1}`);
    } else {
      setStartLevelError('');
    }
  };

  const handleEndLevelChange = (e) => {
    const value = e.target.value;
    setUserEndLevel(value);
    if (value !== '' && (parseInt(value) <= startlevel || parseInt(value) > endlevel)) {
      setEndLevelError(`Level kết thúc phải từ ${startlevel + 1} đến ${endlevel}`);
    } else {
      setEndLevelError('');
    }
  };

  const checkExistingOrder = async (userId) => {
    try {
      const response = await axios.get(`${config.ORDER_API.GET_ORDER_BY_USER_ID}/${userId}`);
      const orders = response.data;
      const isOrder = orders.find(order => 
        order.serviceName === 'IS' && order.status !== 'Xong'
      );
      setExistingOrder(isOrder);
    } catch (error) {
      console.error('Lỗi khi kiểm tra đơn hàng hiện tại:', error);
    }
  };

  const handleOrderSubmit = async () => {
    if (!user || !user.id || !user.fullName) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng đăng nhập để đặt hàng',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        },
        buttonsStyling: false
      });
      return;
    }

    if (existingOrder) {
      Swal.fire({
        title: 'Thông báo!',
        text: 'Dịch vụ này đã được đăng ký. Vui lòng kiểm tra tại trang cá nhân.',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        },
        buttonsStyling: false
      });
      return;
    }

    if (!userStartLevel || !userEndLevel || parseInt(userStartLevel) >= parseInt(userEndLevel)) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng nhập level bắt đầu và kết thúc hợp lệ',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        },
        buttonsStyling: false
      });
      return;
    }

    const orderData = {
      userId: user.id,
      userName: user.fullName,
      serviceName: 'IS',
      serviceDetails: `Level ${userStartLevel} đến ${userEndLevel}`,
      price: totalPrice * 1000,
      discount: savedAmount * 1000,
      status: 'Đã nhận'
    };

    try {
      const result = await Swal.fire({
        title: 'Xác nhận đặt hàng',
        text: `Bạn có chắc chắn muốn đặt dịch vụ IS từ level ${userStartLevel} đến ${userEndLevel} với giá ${totalPrice}K không?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2',
          cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded',
          actions: 'space-x-2',
        },
        buttonsStyling: false
      });

      if (result.isConfirmed) {
        const response = await axios.post(config.ORDER_API.ADD_ORDER, orderData);
        Swal.fire({
          title: 'Thành công!',
          text: 'Đăng ký dịch vụ thành công!',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
          },
          buttonsStyling: false
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.reload();
          }
        });
        console.log('Đơn hàng đã được tạo:', response.data);
        setUserStartLevel('');
        setUserEndLevel('');
        setTotalPrice(0);
        setSavedAmount(0);
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký dịch vụ:', error.response?.data || error.message);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi đăng ký dịch vụ. Vui lòng thử lại.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        },
        buttonsStyling: false
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form submit và tải lại trang
    await handleOrderSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-b-lg shadow-md`}
    >
      <div className="flex items-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden mr-4">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl font-semibold">{name} Content</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Level bắt đầu ({startlevel}-{endlevel - 1}):</label>
          <input 
            type="number" 
            value={userStartLevel}
            onChange={handleStartLevelChange}
            className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50`}
          />
          {startLevelError && <p className="text-red-500 text-xs mt-1">{startLevelError}</p>}
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Level kết thúc ({startlevel + 1}-{endlevel}):</label>
          <input 
            type="number" 
            value={userEndLevel}
            onChange={handleEndLevelChange}
            className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50`}
          />
          {endLevelError && <p className="text-red-500 text-xs mt-1">{endLevelError}</p>}
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-yellow-100 text-gray-800'} p-4 rounded-md mb-4`}>
          <p className="font-semibold">Tổng giá: {totalPrice}K</p>
          {savedAmount > 0 && (
            <p className="text-green-500 mt-2">Tiết kiệm: {savedAmount}K so với giá lẻ</p>
          )}
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 italic`}>"Mỗi tuần sẽ check tiến độ để thanh toán"</p>
        {existingOrder && (
          <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p className="font-bold">Thông báo:</p>
            <p>Bạn đã đăng ký dịch vụ IS và đang trong quá trình xử lý. Vui lòng kiểm tra tại trang cá nhân.</p>
          </div>
        )}
        <button 
          type="submit"
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          Đăng ký dịch vụ
        </button>
      </form>
    </motion.div>
  );
};

const ISService = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedIS, setSelectedIS] = useState(null);
  const [isCards, setIsCards] = useState([]);

  useEffect(() => {
    const fetchISData = async () => {
      try {
        const response = await axios.get(config.IS_API.GET_ALL_IS);
        setIsCards(response.data);
        if (response.data.length > 0) {
          setSelectedIS(response.data[0]._id);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu IS:', error);
      }
    };

    fetchISData();
  }, []);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-2xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>IS - RUSH LEVEL (3 - 6 TUẦN)</h2>
      <p className="text-red-500 text-center mb-6">Không nhận Newbie và JP</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {isCards.map((card) => (
          <ISCard
            key={card._id}
            name={card.name}
            imageUrl={card.imageUrl}
            isSelected={selectedIS === card._id}
            onClick={() => setSelectedIS(card._id)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isCards.map((card) => (
          selectedIS === card._id && (
            <ISContent
              key={card._id}
              name={card.name}
              imageUrl={card.imageUrl}
              startlevel={card.startlevel}
              endlevel={card.endlevel}
            />
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ISService;