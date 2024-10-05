const TheSandService = require('../services/TheSandService');
// Lấy tất cả thông tin shop The TheSand
exports.GetAllShop = async (req, res) => {
    try {
        const shops = await TheSandService.GetAllShop();
        res.status(200).json(shops)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// Thêm mới shop The TheSand
exports.AddShop = async (req, res) => {
    try {
        const shopData = req.body;
        const newshop = await TheSandService.AddShop(shopData);
        res.status(201).json(newshop);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Cập nhật shop The TheSand
exports.UpdateShop = async (req, res) => {
    const {id} = req.params;
    try {
        const updateshop = await TheSandService.UpdateShop(id, req.body);
        if (!updateshop) {
            return res.status(404).json({message: "Shop not found"});
        }
        res.status(200).json(updateshop);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Xóa shop The TheSand
exports.DeleteShop = async (req, res) => {
    const {id} = req.params;
    try {
        const shop = await TheSandService.DeleteShop(id);
        if (!shop) {
            return res.status(404).json({message: "Shop not found"});
        }
        res.status(200).json({message: "Shop deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting shop', error });
    }
}

