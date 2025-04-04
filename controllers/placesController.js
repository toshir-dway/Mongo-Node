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
    const newPlace = new Place(req.body);
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    console.error('Error creating place:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlace) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json(updatedPlace);
  } catch (error) {
    console.error('Error updating place:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ error: 'Server error' });
  }
};