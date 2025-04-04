const Alert = require('../models/alert');

exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createAlert = async (req, res) => {
  try {
    console.log('Received alert data:', req.body);
    
    // Handle both formats
    let alertData;
    
    if (req.body.location) {
      // Already in the correct format
      alertData = req.body;
    } else {
      // Convert from form submission format
      const { title, description, lat, lng, type } = req.body;
      alertData = {
        title,
        description,
        location: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)] // GeoJSON [longitude, latitude]
        },
        type
      };
    }
    
    const newAlert = new Alert(alertData);
    await newAlert.save();
    
    console.log('Alert saved:', newAlert);
    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
};