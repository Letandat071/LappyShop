import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const RegisteredCustomersTable = ({ customers }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng ký</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên người dùng</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gói</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
          </tr>
        </thead>
        <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {customers.map((customer, index) => (
            <tr key={customer.id}>
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">{customer.registerDate}</td>
              <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{customer.package}</td>
              <td className="px-6 py-4 whitespace-nowrap">{customer.price}K</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  customer.status === 'Đang chờ' ? 'bg-yellow-100 text-yellow-800' :
                  customer.status === 'Đang thực hiện' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {customer.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisteredCustomersTable;