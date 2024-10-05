import React, { useState, useEffect } from 'react';
import { Table, Button, Label, TextInput, Textarea, Select, FileInput } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    type: '',
    image: null
  });

  useEffect(() => {
    // Dữ liệu mẫu
    setEvents([
      {
        id: 1,
        name: 'Sự kiện IS3 2024',
        startDate: '2024-05-01',
        endDate: '2024-05-03',
        description: 'Sự kiện thường niên của IS3',
        type: 'Normal',
        image: 'https://example.com/path/to/is3_image.jpg'
      },
      {
        id: 2,
        name: 'Workshop IS3 Mini',
        startDate: '2024-06-15',
        endDate: '2024-06-15',
        description: 'Workshop ngắn về an ninh mạng',
        type: 'Mini',
        image: 'https://example.com/path/to/is3_mini_image.jpg'
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      type: '',
      image: null
    });
    setIsModalVisible(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      ...formData,
      id: editingEvent ? editingEvent.id : Date.now(),
    };
    if (editingEvent) {
      setEvents(events.map(event => event.id === editingEvent.id ? newEvent : event));
    } else {
      setEvents([...events, newEvent]);
    }
    setIsModalVisible(false);
  };

  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Quản lý Event</h2>
      <Button onClick={handleAdd} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
        <HiPlus className="mr-2 h-5 w-5" />
        Thêm Event Mới
      </Button>
      <Table>
        <Table.Head>
          <Table.HeadCell>Ảnh Event</Table.HeadCell>
          <Table.HeadCell>Tên Event</Table.HeadCell>
          <Table.HeadCell>Ngày bắt đầu</Table.HeadCell>
          <Table.HeadCell>Ngày kết thúc</Table.HeadCell>
          <Table.HeadCell>Loại Event</Table.HeadCell>
          <Table.HeadCell>Hành động</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {events.map((event) => (
            <Table.Row key={event.id} className="bg-white">
              <Table.Cell>
                <img src={event.image} alt="Event" className="w-10 h-10 object-cover rounded" />
              </Table.Cell>
              <Table.Cell className="font-medium text-gray-900">{event.name}</Table.Cell>
              <Table.Cell>{event.startDate}</Table.Cell>
              <Table.Cell>{event.endDate}</Table.Cell>
              <Table.Cell>{event.type}</Table.Cell>
              <Table.Cell>
                <div className="flex space-x-2">
                  <Button color="info" onClick={() => handleEdit(event)} className="bg-blue-500 hover:bg-blue-600 text-white">
                    <HiPencil className="mr-2 h-5 w-5" />
                    Sửa
                  </Button>
                  <Button color="failure" onClick={() => handleDelete(event.id)} className="bg-red-500 hover:bg-red-600 text-white">
                    <HiTrash className="mr-2 h-5 w-5" />
                    Xóa
                  </Button>
                </div>
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingEvent ? "Sửa Event" : "Thêm Event Mới"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 mb-2">Tên Event</Label>
                    <TextInput id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="startDate" className="text-gray-700 mb-2">Ngày bắt đầu</Label>
                    <TextInput id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-gray-700 mb-2">Ngày kết thúc</Label>
                    <TextInput id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-700 mb-2">Mô tả Event</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-gray-700 mb-2">Loại Event</Label>
                    <Select id="type" name="type" value={formData.type} onChange={handleInputChange} required>
                      <option value="">Chọn loại event</option>
                      <option value="Mini">Mini</option>
                      <option value="Normal">Normal</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="image" className="text-gray-700 mb-2">Ảnh Event</Label>
                    <FileInput id="image" name="image" onChange={handleFileChange} />
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button type="submit" onClick={handleSubmit} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Lưu
                </Button>
                <Button onClick={() => setIsModalVisible(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;