import React, { useState, useEffect, useCallback } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import config from '../config';
import axios from 'axios';
import { getCurrentUser } from '../utils/auth';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const TheSandService = () => {
  const { isDarkMode } = useDarkMode();
  const [user, setUser] = useState(null); // Thêm state cho user
  const [totalPrice, setTotalPrice] = useState(0);
  const [shops, setShops] = useState([]);
  const [selectedShops, setSelectedShops] = useState({});
  const [discount, setDiscount] = useState(0);
  const [existingOrder, setExistingOrder] = useState(null);

  useEffect(() => {
    fetchShops();
    const currentUser = getCurrentUser();
    // console.log('Current user from cookie:', currentUser);
    // console.log('User cookie raw:', Cookies.get('user'));
    setUser(currentUser);
    if (currentUser && currentUser.id) {
      checkExistingOrder(currentUser.id);
    }
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get(config.THE_SAND_API.GET_ALL_SHOP);
      setShops(response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu shop:', error);
    }
  };

  const updateTotalPrice = useCallback(() => {
    const selectedShopIds = Object.keys(selectedShops);
    const selectedOption = selectedShopIds.length > 0 ? selectedShops[selectedShopIds[0]].option : null;
    
    if (!selectedOption || selectedShopIds.length === 0) {
      setTotalPrice(0);
      setDiscount(0);
      return;
    }

    // Sort shops to ensure shops 1, 2, 3 are always first if selected
    const sortedSelectedShops = selectedShopIds
      .map(id => shops.find(shop => shop._id === id))
      .sort((a, b) => shops.indexOf(a) - shops.indexOf(b));

    let actualTotal = 0;
    let discountedTotal = 0;

    // Check if only shops from 4 onwards are selected and there are multiple shops
    const onlyLaterShops = sortedSelectedShops.every(shop => shops.indexOf(shop) >= 3);
    const multipleShopsSelected = sortedSelectedShops.length > 1;

    sortedSelectedShops.forEach((shop, index) => {
      const price = shop.options[selectedOption];
      actualTotal += price;

      if (onlyLaterShops && multipleShopsSelected) {
        // If multiple shops from 4 onwards are selected, apply 5K discount to each
        discountedTotal += price - 5000;
      } else if (index < 3) {
        // For the first 3 shops, just add the price
        discountedTotal += price;
      } else {
        // For shops 4 and onwards when earlier shops are also selected, subtract 10K from the price
        discountedTotal += Math.max(price - 10000, 0);
      }
    });

    setTotalPrice(discountedTotal / 1000);
    setDiscount((actualTotal - discountedTotal) / 1000);
  }, [selectedShops, shops]);

  useEffect(() => {
    updateTotalPrice();
  }, [updateTotalPrice]);

  const handleShopSelect = (shopId, option) => {
    const shop = shops.find(s => s._id === shopId);
    const price = shop.options[option] / 1000;

    setSelectedShops(prev => {
      const currentOption = Object.values(prev)[0]?.option;
      
      if (currentOption && currentOption !== option) {
        // If new option is different from current option, reset all
        return { [shopId]: { option, price } };
      } else {
        // If same option or no option selected yet
        const newSelected = { ...prev };
        if (newSelected[shopId]) {
          delete newSelected[shopId];
        } else {
          newSelected[shopId] = { option, price };
        }
        return newSelected;
      }
    });
  };

  const checkExistingOrder = async (userId) => {
    try {
      const response = await axios.get(`${config.ORDER_API.GET_ORDER_BY_USER_ID}/${userId}`);
      const orders = response.data;
      const theSandOrder = orders.find(order => 
        order.serviceName === 'The Sand' && order.status !== 'Xong'
      );
      setExistingOrder(theSandOrder);
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

    if (Object.keys(selectedShops).length === 0) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng chọn ít nhất một dịch vụ',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        },
        buttonsStyling: false
      });
      return;
    }

    const serviceDetails = Object.keys(selectedShops)
      .map(shopId => shops.find(shop => shop._id === shopId).shopName)
      .join(', ');

    const orderData = {
      userId: user.id,
      userName: user.fullName,
      serviceName: 'The Sand',
      serviceDetails,
      price: totalPrice * 1000, // Chuyển đổi từ K sang đơn vị tiền tệ
      discount: discount * 1000, // Chuyển đổi từ K sang đơn vị tiền tệ
      status: 'Đã nhận'
    };

    try {
      const result = await Swal.fire({
        title: 'Xác nhận đặt hàng',
        text: `Bạn có chắc chắn muốn đặt dịch vụ The Sand với giá ${totalPrice}K không?`,
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
            // Thay vì tải lại trang, cập nhật trạng thái existingOrder
            setExistingOrder(response.data);
          }
        });
        console.log('Đơn hàng đã được tạo:', response.data);
        setSelectedShops({});
        setTotalPrice(0);
        setDiscount(0);
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

  return (
    <div className={`p-8 transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'} rounded-xl shadow-lg`}>
      <h2 className="text-3xl font-bold mb-6 text-center">The Sand - Các tùy chọn dịch vụ</h2>
      
      {existingOrder && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Thông báo:</p>
          <p>Bạn đã đăng ký dịch vụ The Sand và đang trong quá trình xử lý. Vui lòng kiểm tra tại trang cá nhân.</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin dịch vụ:</h3>
        <ul className="list-disc pl-5">
          <li>NHANH TRONG 6H - 8H</li>
          <li>SLOW 24H - 48H</li>
          <li>Nhận newbie và server JP</li>
          <li>Free nhiệm vụ tháng cho tất cả các option</li>
          <li>Option EX chỉ áp dụng khách dùng 2 dịch vụ</li>
        </ul>
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full mb-6 border-collapse rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-white bg-opacity-70'}`}>
          <thead className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'}`}>
            <tr>
              <th className="p-3 text-left">Shop</th>
              <th className="p-3 text-center">Option nhanh</th>
              <th className="p-3 text-center">Option slow</th>
              <th className="p-3 text-center">Option EX</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr key={shop._id}>
                <td className="p-3">{shop.shopName}</td>
                {['fast', 'slow', 'extra'].map((option) => (
                  <td key={option} className="p-3 text-center">
                    <button
                      onClick={() => handleShopSelect(shop._id, option)}
                      className={`px-4 py-2 rounded ${
                        selectedShops[shop._id]?.option === option
                          ? 'bg-blue-500 text-white'
                          : isDarkMode
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {shop.options[option] / 1000}K
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`p-4 rounded-lg mb-6 shadow-md ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'}`}>
        <p className="font-semibold text-xl text-center text-white">
          Tổng giá: <span className="animate-pulse">{totalPrice}K</span>
        </p>
        {discount > 0 && (
          <p className="text-center text-green-400 mt-2">
            Tiết kiệm: {discount}K
          </p>
        )}
      </div>

      <button 
        onClick={handleOrderSubmit}
        className={`w-full py-3 rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-700' : 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-800'}`}
      >
        Đăng ký dịch vụ
      </button>
    </div>
  );
};

export default TheSandService;