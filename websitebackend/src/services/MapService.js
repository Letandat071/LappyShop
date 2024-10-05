const Map = require('../models/Map');

//Thêm Map 
exports.addMap = async (map) => {
    return await Map.create(map);
};

// Xem tất cả 
exports.getAllMaps = async () => {
    return await Map.find().lean();
};

// Xem theo id
exports.getMapById = async (id) => {
    const map = await Map.findById(id).lean();
    if (!map) throw new Error('Không tìm thấy bản đồ');
    return map;
};

// Cập nhật
exports.updateMap = async (id, newMapData) => {
    console.log("Dữ liệu cập nhật nhận được:", newMapData);
    const updatedMap = await Map.findByIdAndUpdate(id, newMapData, { new: true, runValidators: true });
    if (!updatedMap) throw new Error('Không tìm thấy bản đồ');
    console.log("Bản đồ sau khi cập nhật:", updatedMap);
    return updatedMap.toObject();
};

//Delete map

exports.deleteMap = async (id) => {
    const deletedMap = await Map.findByIdAndDelete(id).lean();
    if (!deletedMap) throw new Error('Không tìm thấy bản đồ');
    return deletedMap;
};