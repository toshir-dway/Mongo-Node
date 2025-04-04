const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alertsController');

router.get('/', alertsController.getAllAlerts);
router.post('/', alertsController.createAlert);

module.exports = router;