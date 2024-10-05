import React, { useState, useEffect, useCallback } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Swal from 'sweetalert2';
import config from '../../config'
const OrderManagement = () => {
  const { darkMode } = useDarkMode();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const filterAndSortOrders = useCallback(() => {
    let filtered = [...orders];

    // Lọc theo ngày
    const now = new Date();
    switch (dateFilter) {
      case 'day':
        filtered = filtered.filter(order => new Date(order.createdAt).toDateString() === now.toDateString());
        break;
      case 'week':
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(order => new Date(order.createdAt) >= oneWeekAgo);
        break;
      case 'month':
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filtered = filtered.filter(order => new Date(order.createdAt) >= oneMonthAgo);
        break;
      default:
        // Không cần thực hiện bất kỳ hành động nào cho trường hợp 'all'
        break;
    }

    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sắp xếp theo ngày tạo, từ mới nhất đến cũ nhất
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredOrders(filtered);
  }, [orders, dateFilter, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [filterAndSortOrders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(config.ORDER_API.GET_ALL_ORDER);
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu đơn hàng');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Cấu trúc dữ liệu không đúng như mong đợi:', data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${config.ORDER_API.UPDATE_ORDER}/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedOrder = await response.json();

      setOrders(prevOrders => {
        const newOrders = prevOrders.map(order => 
          order._id === orderId ? { ...order, status: updatedOrder.status } : order
        );
        return newOrders;
      });

      Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công!',
        text: `Trạng thái đơn hàng đã được cập nhật thành ${newStatus}`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể cập nhật trạng thái đơn hàng',
        confirmButtonText: 'Thử lại',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    Swal.fire({
      title: 'Xác nhận thay đổi',
      text: `Bạn có chắc muốn thay đổi trạng thái đơn hàng thành "${newStatus}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrderStatus(orderId, newStatus);
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang tiến hành':
        return 'bg-yellow-200 text-yellow-800';
      case 'Xong':
        return 'bg-green-200 text-green-800';
      case 'Đã nhận':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h2 className="text-3xl font-bold mb-6">Quản lý Đơn Hàng</h2>
      
      <div className="mb-4 flex space-x-4">
        <select
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="day">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
        </select>
        
        <select
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Đã nhận">Đã nhận</option>
          <option value="Đang tiến hành">Đang tiến hành</option>
          <option value="Xong">Xong</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
          <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
            <thead>
              <tr className="text-left">
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Tên Khách Hàng</th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Dịch Vụ</th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Chi Tiết</th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Giá</th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Giảm Giá</th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Trạng Thái</th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Ngày Tạo</th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order._id} 
                  className={`hover:bg-gray-100 ${order._id === selectedOrderId ? 'bg-yellow-100' : ''}`}
                  onClick={() => setSelectedOrderId(order._id)}
                >
                  <td className="border-dashed border-t border-gray-200 px-6 py-4">{order.userName}</td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-4">{order.serviceName}</td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-4">{order.serviceDetails}</td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-4">{formatCurrency(order.price)}</td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-4">{formatCurrency(order.discount)}</td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-4">{formatDate(order.createdAt)}</td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-4">
                    <select
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Đã nhận">Đã nhận</option>
                      <option value="Đang tiến hành">Đang tiến hành</option>
                      <option value="Xong">Xong</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;