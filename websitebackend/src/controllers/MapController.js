const MapService = require('../services/MapService');

const handleError = (res, error) => {
  console.error('Lỗi:', error);
  res.status(error.status || 500).json({ message: error.message || 'Đã xảy ra lỗi server' });
};

exports.addMap = async (req, res) => {
  try {
    const addedMap = await MapService.addMap(req.body);
    res.status(201).json(addedMap);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getAllMaps = async (req, res) => {
  try {
    const allMaps = await MapService.getAllMaps();
    res.status(200).json(allMaps);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getMapById = async (req, res) => {
  try {
    const map = await MapService.getMapById(req.params.id);
    res.status(200).json(map);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateMap = async (req, res) => {
  try {
    // console.log("Dữ liệu nhận được từ client:", req.body);
    const updatedMap = await MapService.updateMap(req.params.id, req.body);
    // console.log("Bản đồ đã cập nhật:", updatedMap);
    res.status(200).json(updatedMap);
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteMap = async (req, res) => {
  try {
    await MapService.deleteMap(req.params.id);
    res.status(200).json({ message: 'Đã xóa bản đồ thành công' });
  } catch (error) {
    handleError(res, error);
  }
};