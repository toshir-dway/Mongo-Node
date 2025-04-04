const express = require('express');
const router = express.Router();
const placesController = require('../controllers/placesController');

router.get('/', placesController.getAllPlaces);
router.post('/', placesController.createPlace);
router.put('/:id', placesController.updatePlace); // Update a place
router.delete('/:id', placesController.deletePlace); // Delete a place

module.exports = router;