const express = require('express');
const TheSandController = require('../controllers/TheSandController');

const router = express.Router();

router.get('/allshop', TheSandController.GetAllShop);
router.post('/addshop', TheSandController.AddShop);
router.put('/updateshop/:id', TheSandController.UpdateShop);
router.delete('/deleteshop/:id', TheSandController.DeleteShop);

module.exports = router;