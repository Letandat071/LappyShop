const express = require('express');
const router = express.Router();
const ISController = require('../controllers/ISController');

// Thêm IS
router.post('/add', ISController.addIS);

// Xem tất cả IS
router.get('/getall', ISController.getAllIS);

// Xem theo id
router.get('/getbyid/:id', ISController.getISById);

// Cập nhật IS
router.put('/update/:id', ISController.updateIS);

// Xóa IS
router.delete('/delete/:id', ISController.deleteIS);

module.exports = router;

