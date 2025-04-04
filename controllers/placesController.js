const Place = require('../models/place');

exports.getAllPlaces = async (req, res) => {
  const places = await Place.find();
  res.json(places);
};

exports.createPlace = async (req, res) => {
  const { name, location } = req.body;
  const newPlace = new Place({ name, location });
  await newPlace.save();
  res.status(201).json(newPlace);
};