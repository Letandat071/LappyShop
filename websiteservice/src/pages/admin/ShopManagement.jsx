import React, { useState, useEffect } from 'react';
import { Table, Label, TextInput } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { useDarkMode } from '../../contexts/DarkModeContext';
import config from '../../config';
import axios from 'axios';
import Swal from 'sweetalert2';

const ShopManagement = () => {
  const { isDarkMode } = useDarkMode();
  const [shops, setShops] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    prices: [0, 0, 0]
  });

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get(config.THE_SAND_API.GET_ALL_SHOP);
      const formattedShops = response.data.map(shop => ({
        id: shop._id,
        name: shop.shopName,
        prices: [shop.options.fast / 1000, shop.options.slow / 1000, shop.options.extra / 1000]
      }));
      setShops(formattedShops);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu shop:', error);
    }
  };

  // Xóa toàn bộ hàm customRound

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (index, value) => {
    const newPrices = [...formData.prices];
    newPrices[index] = parseInt(value);
    setFormData(prev => ({ ...prev, prices: newPrices }));
  };

  const handleAdd = () => {
    setEditingShop(null);
    setFormData({ name: '', prices: [0, 0, 0] });
    setIsModalVisible(true);
  };

  const handleEdit = (shop) => {
    setEditingShop(shop);
    setFormData(shop);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Bạn không thể hoàn tác hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý, xóa!',
        cancelButtonText: 'Hủy',
        customClass: {
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded',
          cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2'
        },
        buttonsStyling: false
      });
      if (result.isConfirmed) {
        await axios.delete(`${config.THE_SAND_API.DELETE_SHOP}/${id}`);
        Swal.fire({
          title: 'Đã xóa!',
          text: 'Shop đã được xóa thành công.',
          icon: 'success',
          customClass: {
            confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
          },
          buttonsStyling: false
        });
        fetchShops();
      }
    } catch (error) {
      console.error('Lỗi khi xóa shop:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi xóa shop.',
        icon: 'error',
        customClass: {
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
        },
        buttonsStyling: false
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newShop = {
      shopName: formData.name,
      options: {
        fast: formData.prices[0] * 1000,
        slow: formData.prices[1] * 1000,
        extra: formData.prices[2] * 1000
      }
    };

    try {
      if (editingShop) {
        await axios.put(`${config.THE_SAND_API.UPDATE_SHOP}/${editingShop.id}`, newShop);
        Swal.fire({
          title: 'Thành công!',
          text: 'Shop đã được cập nhật.',
          icon: 'success',
          customClass: {
            confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
          },
          buttonsStyling: false
        });
      } else {
        await axios.post(config.THE_SAND_API.ADD_SHOP, newShop);
        Swal.fire({
          title: 'Thành công!',
          text: 'Shop mới đã được thêm.',
          icon: 'success',
          customClass: {
            confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
          },
          buttonsStyling: false
        });
      }
      fetchShops();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi lưu shop:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi lưu shop.',
        icon: 'error',
        customClass: {
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
        },
        buttonsStyling: false
      });
    }
  };

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h2 className="text-2xl font-bold mb-4">Quản lý Shop The Sand</h2>
      <button onClick={handleAdd} className={`mb-4 px-4 py-2 rounded-lg flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
        <HiPlus className="mr-2 h-5 w-5" />
        Thêm Shop Mới
      </button>
      <Table>
        <Table.Head>
          <Table.HeadCell>Tên Shop</Table.HeadCell>
          <Table.HeadCell>Option nhanh</Table.HeadCell>
          <Table.HeadCell>Option slow</Table.HeadCell>
          <Table.HeadCell>Option EX</Table.HeadCell>
          <Table.HeadCell>Hành động</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {shops.map((shop) => (
            <Table.Row key={shop.id} className={isDarkMode ? 'bg-gray-700' : 'bg-white'}>
              <Table.Cell className="font-medium">{shop.name}</Table.Cell>
              {shop.prices.map((price, index) => (
                <Table.Cell key={index}>{price}K</Table.Cell>
              ))}
              <Table.Cell>
                {!shop.isFullShop && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(shop)} className={`px-3 py-1 rounded-lg flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                      <HiPencil className="mr-2 h-5 w-5" />
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(shop.id)} className={`px-3 py-1 rounded-lg flex items-center ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}>
                      <HiTrash className="mr-2 h-5 w-5" />
                      Xóa
                    </button>
                  </div>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {isModalVisible && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-20"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className={`inline-block align-bottom ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium mb-4">
                  {editingShop ? "Sửa Shop" : "Thêm Shop Mới"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="mb-2">Tên Shop</Label>
                    <TextInput id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  {['Option nhanh', 'Option slow', 'Option EX'].map((option, index) => (
                    <div key={option}>
                      <Label htmlFor={`price-${index}`} className="mb-2">{option}</Label>
                      <TextInput
                        id={`price-${index}`}
                        type="number"
                        value={formData.prices[index]}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" onClick={handleSubmit} className={`w-full sm:w-auto px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
                  Lưu
                </button>
                <button onClick={() => setIsModalVisible(false)} className={`mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopManagement;