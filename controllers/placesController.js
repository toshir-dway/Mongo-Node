const Place = require('../models/place');

exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    console.error('Error getting places:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createPlace = async (req, res) => {
  try {
    console.log('Received place data:', req.body);
    
    // Handle both formats
    let placeData;
    
    if (req.body.location) {
      // Already in the correct format
      placeData = req.body;
    } else {
      // Convert from form submission format
      const { name, description, lat, lng, type } = req.body;
      placeData = {
        name,
        description,
        location: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)] // GeoJSON [longitude, latitude]
        },
        type
      };
    }
    
    const newPlace = new Place(placeData);
    await newPlace.save();
    
    console.log('Place saved:', newPlace);
    res.status(201).json(newPlace);
  } catch (error) {
    console.error('Error creating place:', error);
    res.status(500).json({ error: 'Server error' });
  }
};