import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';

const AnnouncementBanner = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-lg mb-8 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex items-center space-x-4">
        <img
          src="https://imgur.com/Y91TxKt.jpg"
          alt="Nguyên kỷ"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold text-red-600">Lưu ý quan trọng:</p>
          <ul className="list-disc list-inside text-sm">
            <li>Website này chỉ để đăng ký danh sách dịch vụ</li>
            <li>Không hề nạp hay lấy chi phí nào</li>
            <li>Sau khi đăng ký, hãy liên hệ để xác nhận lại dịch vụ</li>
            <li>Chỉ thanh toán sau khi đã hoàn tất dịch vụ</li>
            <li>
              Liên hệ Facebook:{' '}
              <a
                href="https://www.facebook.com/nyaamv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Nguyên kỷ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementBanner;