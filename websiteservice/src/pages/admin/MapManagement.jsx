import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../../../../websiteservice/src/config';
; // Thay đổi URL API nếu cần

const MapManagement = () => {
  const [maps, setMaps] = useState([]);
  const [newMap, setNewMap] = useState({ nameMap: '', imageMap: '', levels: [] });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMap, setEditingMap] = useState(null);

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const response = await axios.get(config.MAP_API.GET_ALL_MAP);
      setMaps(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bản đồ:', error);
    }
  };

  const handleAddMap = async () => {
    try {
      await axios.post(config.MAP_API.ADD_MAP, newMap);
      setNewMap({ nameMap: '', imageMap: '', levels: [] });
      fetchMaps();
      Swal.fire('Thành công', 'Đã thêm bản đồ mới', 'success');
    } catch (error) {
      console.error('Lỗi khi thêm bản đồ:', error);
      Swal.fire('Lỗi', 'Không thể thêm bản đồ', 'error');
    }
  };

  const handleEditMap = (map) => {
    setEditingMap(map);
    setIsModalVisible(true);
  };

  const handleUpdateMap = async () => {
    try {
      await axios.put(config.MAP_API.UPDATE_MAP + '/' + editingMap._id, editingMap);
      setIsModalVisible(false);
      fetchMaps();
      Swal.fire('Thành công', 'Đã cập nhật bản đồ', 'success');
    } catch (error) {
      console.error('Lỗi khi cập nhật bản đồ:', error);
      Swal.fire('Lỗi', 'Không thể cập nhật bản đồ', 'error');
    }
  };

  const handleDeleteMap = async (mapId) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(config.MAP_API.DELETE_MAP + '/' + mapId);
        fetchMaps();
        Swal.fire('Đã xóa!', 'Bản đồ đã được xóa.', 'success');
      } catch (error) {
        console.error('Lỗi khi xóa bản đồ:', error);
        Swal.fire('Lỗi', 'Không thể xóa bản đồ', 'error');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Màn chơi</h1>
      
      {/* Form thêm màn chơi mới */}
      <div className="mb-4 space-y-2">
        <input
          className="w-full p-2 border rounded"
          placeholder="Tên màn chơi"
          value={newMap.nameMap}
          onChange={(e) => setNewMap({ ...newMap, nameMap: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Link ảnh"
          value={newMap.imageMap}
          onChange={(e) => setNewMap({ ...newMap, imageMap: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Các level (phân cách bằng dấu phẩy)"
          value={newMap.levels.join(',')}
          onChange={(e) => setNewMap({ ...newMap, levels: e.target.value.split(',') })}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={handleAddMap}
        >
          <FaPlus className="mr-2" /> Thêm màn chơi
        </button>
      </div>

      {/* Danh sách các màn chơi */}
      <div className="space-y-4">
        {maps.map((map) => (
          <div key={map._id} className="bg-white border rounded-lg shadow-md overflow-hidden flex">
            <div className="w-40 h-40 flex-shrink-0">
              <img 
                src={map.imageMap} 
                alt={map.nameMap} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{map.nameMap}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {map.levels.map((level, index) => (
                    <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
                      {level}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center"
                  onClick={() => handleEditMap(map)}
                >
                  <FaEdit className="mr-1" /> Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                  onClick={() => handleDeleteMap(map._id)}
                >
                  <FaTrash className="mr-1" /> Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal chỉnh sửa màn chơi */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa màn chơi</h2>
            {editingMap && (
              <div className="space-y-2">
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Tên màn chơi"
                  value={editingMap.nameMap}
                  onChange={(e) => setEditingMap({ ...editingMap, nameMap: e.target.value })}
                />
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Link ảnh"
                  value={editingMap.imageMap}
                  onChange={(e) => setEditingMap({ ...editingMap, imageMap: e.target.value })}
                />
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Các level (phân cách bằng dấu phẩy)"
                  value={editingMap.levels.join(',')}
                  onChange={(e) => setEditingMap({ ...editingMap, levels: e.target.value.split(',') })}
                />
              </div>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsModalVisible(false)}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateMap}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapManagement;