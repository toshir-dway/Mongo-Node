const Alert = require('../models/alert');

exports.getAllAlerts = async (req, res) => {
  const alerts = await Alert.find();
  res.json(alerts);
};

exports.createAlert = async (req, res) => {
  const { title, description } = req.body;
  const newAlert = new Alert({ title, description });
  await newAlert.save();
  res.status(201).json(newAlert);
};