const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.get('/all', OrderController.GetAllOrder);
router.get('/:serviceName', OrderController.GetOrdersByService);
router.post('/add', OrderController.AddOrder);
router.put('/update/:id', OrderController.UpdateOrder);
router.delete('/delete/:id', OrderController.DeleteOrder);
router.get('/user/:userId', OrderController.GetOrdersByUserId);
module.exports = router;