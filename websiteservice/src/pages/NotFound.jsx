import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-9xl font-extrabold text-red-500">404</h1>
      <h2 className="text-4xl font-bold mt-4 mb-2">Trang không tìm thấy</h2>
      <p className="text-xl mb-8">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Quay về trang chủ
      </Link>
    </div>
  )
}

export default NotFound