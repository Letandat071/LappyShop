import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';
import ServiceTable from '../components/ServiceTable';

const UserServicesPage = () => {
  const { isDarkMode } = useDarkMode();
  const [services, setServices] = useState({
    theSand: [],
    is: [],
    map: [],
    event: []
  });

  useEffect(() => {
    // Ở đây, bạn sẽ tải dữ liệu dịch vụ từ API hoặc nguồn dữ liệu khác
    // Đây chỉ là dữ liệu mẫu
    setServices({
      theSand: [
        { id: 1, registerDate: '2023-06-01', package: 'Shop 1', price: 40, status: 'Đang chờ' },
        { id: 2, registerDate: '2023-06-02', package: 'Shop 2', price: 35, status: 'Đang thực hiện' },
      ],
      is: [
        { id: 1, registerDate: '2023-06-03', package: 'IS2', price: 100, status: 'Đã hoàn thành' },
      ],
      map: [
        { id: 1, registerDate: '2023-06-04', package: 'Episode 1', price: 50, status: 'Đang thực hiện' },
      ],
      event: [
        { id: 1, registerDate: '2023-06-05', package: 'Mini Event', price: 20, status: 'Đang chờ' },
      ],
    });
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="flex-grow container mx-auto px-4 py-12">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dịch vụ của bạn
        </motion.h1>

        <motion.div 
          className="space-y-10 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ServiceTable title="The Sand" services={services.theSand} />
          <ServiceTable title="IS" services={services.is} />
          <ServiceTable title="Map" services={services.map} />
          <ServiceTable title="Event" services={services.event} />
        </motion.div>
      </div>
    </div>
  );
};

export default UserServicesPage;