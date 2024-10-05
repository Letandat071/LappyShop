import React from 'react'
import { motion } from 'framer-motion'
import { FaDiscord, FaEnvelope, FaPhone } from 'react-icons/fa'

const MenuComponent = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  }

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.footer 
    className="bg-gray-900 text-white py-12"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between space-y-8 md:space-y-0">
          <motion.div className="w-full md:w-1/3 pr-6" variants={childVariants}>
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Lappy Shop</h3>
            <p className="text-gray-300 leading-relaxed">Chúng tôi cung cấp dịch vụ hỗ trợ game chất lượng cao cho The Sand, IS, và các sự kiện game khác.</p>
          </motion.div>
          <motion.div className="w-full md:w-1/3" variants={childVariants}>
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Dịch vụ</h3>
            <ul className="text-gray-300 space-y-2">
              {['The Sand', 'IS (IS2, IS3, IS4)', 'Map Event', 'Sự kiện đặc biệt'].map((service, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5, color: "#FCD34D" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="w-full md:w-1/3" variants={childVariants}>
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Liên hệ</h3>
            <ul className="text-gray-300 space-y-4">
              <motion.li className="flex items-center" whileHover={{ x: 5 }}>
                <FaEnvelope className="mr-2 text-yellow-400" />
                support@lappyshop.com
              </motion.li>
              <motion.li className="flex items-center" whileHover={{ x: 5 }}>
                <FaDiscord className="mr-2 text-yellow-400" />
                LappyShop#1234
              </motion.li>
              <motion.li className="flex items-center" whileHover={{ x: 5 }}>
                <FaPhone className="mr-2 text-yellow-400" />
                0123456789 (Zalo)
              </motion.li>
            </ul>
          </motion.div>
        </div>
        <motion.div 
          className="border-t border-gray-700 mt-8 pt-8 text-center"
          variants={childVariants}
        >
          <p className="text-gray-400">&copy; 2024 Lappy Shop. Tất cả quyền được bảo lưu.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default MenuComponent