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

exports.createAlert = async (req, res, next) => {
  try {
    console.log('Received alert data:', req.body);

    let alertData;

    if (req.body.location) {
      // Format complet (JSON API)
      alertData = req.body;
    } else {
      // Format formulaire
      const { title, description, lat, lng, type, duration } = req.body;

      const durationDays = parseInt(duration) || 7;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      alertData = {
        title,
        description,
        location: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        type,
        expiresAt
      };
    }

    // Ajout du champ obligatoire pour Time Series
    alertData.createdAt = new Date();

    // Sécurité : fallback expiresAt si absent
    if (!alertData.expiresAt) {
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 7);
      alertData.expiresAt = fallback;
    }

    // Insertion directe dans la collection Time Series
    const result = await Alert.collection.insertOne(alertData);

    console.log('Alert saved:', alertData);
    res.status(201).json(alertData);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
