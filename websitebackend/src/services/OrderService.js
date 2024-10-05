const Order = require('../models/Order');
const mongoose = require('mongoose'); // Thêm dòng này

// Hiển thị danh sách đơn hàng theo loại dịch vụ
exports.GetOrdersByService = async (serviceName) => {
    const orders = await Order.find({ serviceName: serviceName });
    return orders;
};

// Hiển thị tất cả đơn hàng được nhóm theo loại dịch vụ
exports.GetAllOrder = async () => {
    const orders = await Order.find({});
    return orders;
};

//Thêm đơn hàng
exports.AddOrder = async (order) => {
    const newOrder = await Order.create(order);
    return newOrder;  // Trả về trực tiếp, không cần gọi save()
};

//Cập nhật đơn hàng
exports.UpdateOrder = async (id, orderData) => {
    const updatedOrder = await Order.findByIdAndUpdate(id, orderData, { new: true });
    return updatedOrder;
};  

//Xóa đơn hàng
exports.DeleteOrder = async (orderID) => {
    return Order.findByIdAndDelete(orderID);
}

exports.GetOrdersByUserId = async (userId) => {
    try {
        console.log('Received userId:', userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid userId format');
        }
        // Sử dụng new để tạo một instance mới của ObjectId
        const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) });
        console.log('Orders found:', orders);
        return orders;
    } catch (error) {
        console.error('Error in GetOrdersByUserId:', error);
        throw error;
    }
}
