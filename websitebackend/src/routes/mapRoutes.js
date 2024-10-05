const express = require('express')
const MapController = require('../controllers/MapController')

const router = express.Router();

router.post('/add', MapController.addMap)
router.get('/getall', MapController.getAllMaps)
router.get('/getmap/:id', MapController.getMapById)
router.put('/updatemap/:id', MapController.updateMap)
router.delete('/deletemap/:id', MapController.deleteMap)

module.exports = router
