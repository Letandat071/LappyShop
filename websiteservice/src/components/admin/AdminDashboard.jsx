import React, { useState, useEffect } from 'react';
import { FaUsers, FaClipboardList, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import authMiddleware from '../../middleware/authMiddleware';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatCard = ({ icon: Icon, title, value, color }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <motion.div
      className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} ${isDarkMode ? 'bg-opacity-20' : 'bg-opacity-10'}`}>
          <Icon className={`text-2xl ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="ml-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{title}</h3>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const EventCard = ({ title, endDate, daysLeft }) => {
  const { isDarkMode } = useDarkMode();
  const isEnding = daysLeft <= 3;

  return (
    <motion.div
      className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isEnding ? 'border-2 border-red-500' : ''}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{title}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kết thúc: {endDate}</p>
        </div>
        <div className={`text-xl font-bold ${isEnding ? 'text-red-500' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
          {daysLeft} ngày
        </div>
      </div>
    </motion.div>
  );
};

const ComparisonChart = ({ data, isDarkMode }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: isDarkMode ? 'white' : 'black', boxWidth: 10, padding: 5 },
      },
      title: {
        display: true,
        text: 'So sánh lượt đăng ký và truy cập',
        color: isDarkMode ? 'white' : 'black',
        font: { size: 14 }
      },
    },
    scales: {
      x: { 
        ticks: { color: isDarkMode ? 'white' : 'black', font: { size: 10 } },
      },
      y: { 
        ticks: { color: isDarkMode ? 'white' : 'black', font: { size: 10 } },
      },
    },
    elements: {
      point: {
        radius: 2,
      },
      line: {
        borderWidth: 1,
      },
    },
  };

  const chartData = {
    labels: ['0h', '6h', '12h', '18h', '24h'],
    datasets: [
      {
        label: 'Đăng ký hôm nay',
        data: data.registrations.today,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Đăng ký ngày mai',
        data: data.registrations.tomorrow,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Truy cập hôm nay',
        data: data.visits.today,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
      {
        label: 'Truy cập ngày mai',
        data: data.visits.tomorrow,
        borderColor: 'rgb(255, 206, 86)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ height: '300px' }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

const AdminDashboard = () => {
  const { isDarkMode } = useDarkMode();
  const [theSandCountdown, setTheSandCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTheSandCountdown((prevCount) => {
        if (prevCount <= 1) {
          // Yêu cầu cập nhật cửa hàng mới
          alert('Đã đến lúc cập nhật cửa hàng mới cho sự kiện The Sand!');
          return 30;
        }
        return prevCount - 1;
      });
    }, 86400000); // Cập nhật mỗi ngày (24 * 60 * 60 * 1000 ms)

    return () => clearInterval(timer);
  }, []);

  // Giả sử chúng ta có dữ liệu này từ API hoặc state management
  const stats = {
    pageViews: 10000,
    registeredUsers: 500,
    serviceSubscriptions: 300,
    totalRevenue: '50.000.000 VND'
  };

  const events = [
    { title: 'Sự kiện mùa hè', endDate: '2023-08-31', daysLeft: 15 },
    { title: 'Khuyến mãi đặc biệt', endDate: '2023-07-15', daysLeft: 2 },
    { title: 'The Sand', endDate: 'Lặp lại mỗi 30 ngày', daysLeft: theSandCountdown },
  ];

  const comparisonData = {
    registrations: {
      today: [10, 20, 35, 45, 60],
      tomorrow: [15, 25, 40, 50, 70],
    },
    visits: {
      today: [100, 200, 350, 450, 600],
      tomorrow: [150, 250, 400, 500, 700],
    },
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FaChartLine} title="Lượt truy cập" value={stats.pageViews} color="bg-blue-500" />
        <StatCard icon={FaUsers} title="Người dùng đã đăng ký" value={stats.registeredUsers} color="bg-green-500" />
        <StatCard icon={FaClipboardList} title="Gói đã đăng ký" value={stats.serviceSubscriptions} color="bg-yellow-500" />
        <StatCard icon={FaShoppingCart} title="Tổng doanh thu" value={stats.totalRevenue} color="bg-purple-500" />
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">So sánh dữ liệu</h2>
      <div className="mb-8">
        <ComparisonChart data={comparisonData} isDarkMode={isDarkMode} />
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Sự kiện đang diễn ra</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </div>
  );
};

export default authMiddleware(AdminDashboard);