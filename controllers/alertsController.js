const Alert = require('../models/alert');

exports.getAllAlerts = async (req, res) => {
  try {
    // Ne récupère que les alertes non expirées
    const alerts = await Alert.find({ expiresAt: { $gt: new Date() } });
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
      const { title, description, lat, lng, type, duration } = req.body;
      
      // Calcul de la date d'expiration basée sur la durée en jours
      const durationDays = parseInt(duration) || 7; // Par défaut 7 jours si non spécifié
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);
      
      alertData = {
        title,
        description,
        location: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)] // GeoJSON [longitude, latitude]
        },
        type,
        expiresAt
      };
    }
    
    // Si expiresAt n'est pas défini, on le définit par défaut à 7 jours
    if (!alertData.expiresAt) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      alertData.expiresAt = expiresAt;
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