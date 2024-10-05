const ISService = require('../services/ISService');

// Thêm IS
exports.addIS = async (req, res) => {
    try {
        const IS = await ISService.addIS(req.body);
        res.status(201).json(IS);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

// Xem tất cả IS
exports.getAllIS = async (req, res) => {
    try {
        const IS = await ISService.getAllIS();
        res.status(200).json(IS);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Xem theo id
exports.getISById = async (req, res) => {
    try {
        const IS = await ISService.getISById(req.params.id);
        res.status(200).json(IS);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Cập nhật IS
exports.updateIS = async (req, res) => {
    try {
        const IS = await ISService.updateIS(req.params.id, req.body);
        res.status(200).json(IS);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Xóa IS
exports.deleteIS = async (req, res) => {
    try {
        const IS = await ISService.deleteIS(req.params.id);
        res.status(200).json(IS);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
