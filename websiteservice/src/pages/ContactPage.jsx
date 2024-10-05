import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';
import { FaFacebook } from 'react-icons/fa';

const ContactPage = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <motion.div 
        className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} p-10 rounded-xl shadow-2xl`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold">Liên hệ</h2>
        <p className="mt-2 text-center text-sm">
          Để biết thêm thông tin, vui lòng liên hệ qua Facebook:
        </p>
        <div className="mt-8">
          <a
            href="https://www.facebook.com/nyaamv"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            <FaFacebook className="mr-2" />
            Liên hệ qua Facebook
          </a>
        </div>
        <div className="mt-6 text-center">
          <img
            src="https://imgur.com/Y91TxKt.jpg"
            alt="Nguyên kỷ"
            className="w-32 h-32 mx-auto rounded-full"
          />
          <p className="mt-2 font-medium">Nguyên kỷ</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;