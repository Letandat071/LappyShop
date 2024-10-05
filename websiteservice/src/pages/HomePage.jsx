import React, { useState } from 'react';
import GameCards from '../components/GameCards';
import TheSandService from '../components/TheSandService';
import ISService from '../components/ISService';
import MapService from '../components/MapService';
import EventService from '../components/EventService';
import CompletedCustomersTable from '../components/CompletedCustomersTable';
import RegisteredCustomersTable from '../components/RegisteredCustomersTable';
import AnnouncementBanner from '../components/AnnouncementBanner';
const HomePage = () => {
  const [selectedGame, setSelectedGame] = useState('The Sand');

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const customers = [
    // Mảng chứa dữ liệu khách hàng
    {
      id: 1,
      registerDate: '2023-05-01',
      name: 'Nguyễn Văn A',
      package: 'The Sand - Basic',
      price: 100,
      status: 'Đang chờ'
    },
    {
      id: 2,
      registerDate: '2023-05-02',
      name: 'Trần Thị B',
      package: 'IS - Premium',
      price: 200,
      status: 'Đang thực hiện'
    },
    {
      id: 3,
      registerDate: '2023-05-03',
      name: 'Lê Văn C',
      package: 'Map - Standard',
      price: 150,
      status: 'Đã hoàn thành'
    },
    {
      id: 4,
      registerDate: '2023-05-04',
      name: 'Phạm Thị D',
      package: 'Event - Basic',
      price: 80,
      status: 'Đang chờ'
    },
    {
      id: 5,
      registerDate: '2023-05-05',
      name: 'Hoàng Văn E',
      package: 'The Sand - Premium',
      price: 250,
      status: 'Đã hoàn thành'
    },
    {
      id: 6,
      registerDate: '2023-05-06',
      name: 'Ngô Thị F',
      package: 'IS - Standard',
      price: 180,
      status: 'Đang thực hiện'
    },
    {
      id: 7,
      registerDate: '2023-05-07',
      name: 'Đặng Văn G',
      package: 'Map - Premium',
      price: 220,
      status: 'Đã hoàn thành'
    },
    {
      id: 8,
      registerDate: '2023-05-08',
      name: 'Bùi Thị H',
      package: 'Event - Standard',
      price: 120,
      status: 'Đang chờ'
    },
    {
      id: 9,
      registerDate: '2023-05-09',
      name: 'Lý Văn I',
      package: 'The Sand - Standard',
      price: 150,
      status: 'Đang thực hiện'
    },
    {
      id: 10,
      registerDate: '2023-05-10',
      name: 'Trương Thị K',
      package: 'IS - Basic',
      price: 90,
      status: 'Đã hoàn thành'
    }
  ];

  return (
    
    <div className="container mx-auto px-4 py-8">
      <AnnouncementBanner />
      <GameCards onSelectGame={handleGameSelect} selectedGame={selectedGame} />
      {selectedGame === 'The Sand' && <TheSandService />}
      {selectedGame === 'IS' && <ISService />}
      {selectedGame === 'Map' && <MapService />}
      {selectedGame === 'Event' && <EventService />}

      <h2 className="text-2xl font-bold mt-4 mb-4 text-white">Danh sách khách hàng đã đăng ký</h2>
      <RegisteredCustomersTable customers={customers} />
      
      <h2 className="text-2xl font-bold my-4 text-white">Danh sách khách hàng đã hoàn thành</h2>
      <CompletedCustomersTable customers={customers} />
    </div>

  );
};

export default HomePage;