const IS = require('../models/IS');

class ISService {
    // Thêm IS
    static async addIS(data) {
        try {
            return await IS.create(data);
        } catch (error) {
            throw error;
        }
    }

    // Xem tất cả IS
    static async getAllIS() {
        try {
            return await IS.find();
        } catch (error) {
            throw error;
        }
    }

    // Xem theo id
    static async getISById(id) {
        try {
            return await IS.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật IS
    static async updateIS(id, data) {
        try {
            return await IS.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw error;
        }
    }

    // Xóa IS
    static async deleteIS(id) {
        try {
            return await IS.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ISService;
