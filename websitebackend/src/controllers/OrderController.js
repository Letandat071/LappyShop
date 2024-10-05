const OrderService = require('../services/OrderService');
const mongoose = require('mongoose');

//Hiển thị danh sách đơn hàng
exports.GetAllOrder = async (req, res) => {
    try {
        const orders = await OrderService.GetAllOrder();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Thêm đơn hàng
exports.AddOrder = async (req, res) => {
    try {
        console.log('Received order data:', req.body); // Thêm dòng này để log dữ liệu nhận được
        const newOrder = await OrderService.AddOrder(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error in AddOrder:', error); // Thêm dòng này để log lỗi
        res.status(500).json({ error: error.message });
    }
}

//Cập nhật đơn hàng
exports.UpdateOrder = async (req, res) => {
    try {
        const updatedOrder = await OrderService.UpdateOrder(req.params.id, req.body);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Xóa đơn hàng
exports.DeleteOrder = async (req, res) => {
    try {
        await OrderService.DeleteOrder(req.params.id);
        res.status(200).json({ message: 'Đơn hàng đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Lấy danh sách đơn hàng theo loại dịch vụ
exports.GetOrdersByService = async (req, res) => {
    try {
        const orders = await OrderService.GetOrdersByService(req.params.serviceName);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.GetOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('Received request for userId:', userId);
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }
        const orders = await OrderService.GetOrdersByUserId(userId);
        console.log('Orders returned:', orders);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error in GetOrdersByUserId:', error);
        res.status(500).json({ error: error.message });
    }
};


