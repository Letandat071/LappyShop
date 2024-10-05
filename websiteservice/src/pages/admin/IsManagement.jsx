import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../../config';
const IsManagement = () => {
  const [isItems, setIsItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', startlevel: '', endlevel: '', imageUrl: '' });
  const [editingId, setEditingId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    fetchIsItems();
  }, []);

  const fetchIsItems = async () => {
    try {
      const response = await axios.get(config.IS_API.GET_ALL_IS);
      setIsItems(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách IS:', error);
      showAlert('Lỗi', 'Không thể lấy danh sách IS', 'error');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${config.IS_API.UPDATE_IS}/${editingId}`, formData);
        showAlert('Thành công', 'IS đã được cập nhật', 'success');
      } else {
        await axios.post(config.IS_API.ADD_IS, formData);
        showAlert('Thành công', 'IS mới đã được thêm', 'success');
      }
      fetchIsItems();
      setFormData({ name: '', startlevel: '', endlevel: '', imageUrl: '' });
      setEditingId(null);
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật IS:', error);
      showAlert('Lỗi', 'Không thể thêm/cập nhật IS', 'error');
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, startlevel: item.startlevel, endlevel: item.endlevel, image: item.imageUrl || '' });
    setEditingId(item._id);
    setIsPopupOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Hủy',
      customClass: {
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${config.IS_API.DELETE_IS}/${id}`);
        fetchIsItems();
        showAlert('Đã xóa!', 'IS đã được xóa.', 'success');
      } catch (error) {
        console.error('Lỗi khi xóa IS:', error);
        showAlert('Lỗi', 'Không thể xóa IS', 'error');
      }
    }
  };

  const showAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
      },
      buttonsStyling: false
    });
  };

  const openPopup = () => {
    setFormData({ name: '', startlevel: '', endlevel: '', imageUrl: '' });
    setEditingId(null);
    setIsPopupOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý IS</h2>
      <button onClick={openPopup} className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Thêm IS mới
      </button>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Cấp độ bắt đầu</th>
              <th className="px-4 py-2">Cấp độ kết thúc</th>
              <th className="px-4 py-2">Hình ảnh</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isItems.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.startlevel}</td>
                <td className="px-4 py-2">{item.endlevel}</td>
                <td className="px-4 py-2">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
                  )}
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">{editingId ? 'Chỉnh sửa IS' : 'Thêm IS mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tên IS"
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="startlevel"
                value={formData.startlevel}
                onChange={handleInputChange}
                placeholder="Cấp độ bắt đầu"
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="endlevel"
                value={formData.endlevel}
                onChange={handleInputChange}
                placeholder="Cấp độ kết thúc"
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="URL hình ảnh"
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsPopupOpen(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                  Hủy
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IsManagement;