const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alertsController');

router.get('/', alertsController.getAllAlerts);
router.post('/', alertsController.createAlert);
router.put('/:id', alertsController.updateAlert); // Update an alert
router.delete('/:id', alertsController.deleteAlert); // Delete an alert

module.exports = router;