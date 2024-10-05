import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';

const ServiceTable = ({ title, services }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
      <div className="overflow-x-auto">
        <table className={`min-w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">STT</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày đăng ký</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gói</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
            {services.map((service, index) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.registerDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.package}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.price}K</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    service.status === 'Đang chờ' ? 'bg-yellow-100 text-yellow-800' :
                    service.status === 'Đang thực hiện' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {service.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ServiceTable;