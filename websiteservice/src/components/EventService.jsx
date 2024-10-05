import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';

const EventService = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('mini');
  const [farmDays, setFarmDays] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState({
    mini: [],
    normal: []
  });

  const calculateFarmCost = (days) => {
    const freeDays = Math.floor(days / 7);
    return (days - freeDays) * 5000;
  };

  const handleOptionChange = (event, type) => {
    const { value, checked } = event.target;
    setSelectedOptions(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(option => option !== value)
    }));
  };

  const miniOptions = [
    { value: '2K', label: '2K/ Màn Thường' },
    { value: '4K', label: '4K/ Màn Thường + CM' }
  ];

  const normalOptions = [
    { value: '2K', label: '2K/ Màn Thường' },
    { value: '4K_Ex', label: '4K/ Màn Ex' },
    { value: '6K', label: '6K/ Màn Ex có Boss' },
    { value: '4K_S', label: '4K Màn S' },
    { value: '5K', label: '5K màn 200-400 địch' }
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-md mb-8`}>
      <h2 className={`text-2xl font-bold text-center ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-4`}>EVENT</h2>
      

      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 ${
            activeTab === 'mini'
              ? 'bg-blue-500 text-white'
              : isDarkMode
              ? 'bg-gray-600 text-gray-200'
              : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setActiveTab('mini')}
        >
          Mini Event
        </button>
        <button
          className={`flex-1 py-2 ${
            activeTab === 'normal'
              ? 'bg-blue-500 text-white'
              : isDarkMode
              ? 'bg-gray-600 text-gray-200'
              : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setActiveTab('normal')}
        >
          Normal Event
        </button>
      </div>

      {activeTab === 'mini' && (
        <div className="mb-4">
          <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-gray-100' : ''}`}>Mini Event Options:</h3>
          <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-500'} italic mb-2`}>Chỉ chọn loại map mà bạn cần</p>
          {miniOptions.map(option => (
            <div key={option.value} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`mini-${option.value}`}
                value={option.value}
                checked={selectedOptions.mini.includes(option.value)}
                onChange={(e) => handleOptionChange(e, 'mini')}
                className="mr-2"
              />
              <label htmlFor={`mini-${option.value}`} className={isDarkMode ? 'text-gray-300' : ''}>{option.label}</label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'normal' && (
        <div className="mb-4">
          <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-gray-100' : ''}`}>Normal Event Options:</h3>
          {normalOptions.map(option => (
            <div key={option.value} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`normal-${option.value}`}
                value={option.value}
                checked={selectedOptions.normal.includes(option.value)}
                onChange={(e) => handleOptionChange(e, 'normal')}
                className="mr-2"
              />
              <label htmlFor={`normal-${option.value}`} className={isDarkMode ? 'text-gray-300' : ''}>{option.label}</label>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4">
        <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-gray-100' : ''}`}>Farm Event: (Chỉ điền khi bạn muốn farm)</h3>
        <input
          type="number"
          min="1"
          value={farmDays}
          onChange={(e) => setFarmDays(e.target.value)}
          className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
          placeholder="Số ngày farm"
        />
        <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
          Giá: {calculateFarmCost(farmDays).toLocaleString()} VND
          {farmDays >= 7 && ` (Bao gồm ${Math.floor(farmDays / 7)} ngày miễn phí)`}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 px-4 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-800 hover:bg-blue-700'} text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
      >
        Đăng ký Event
      </motion.button>
    </div>
  );
};

export default EventService;