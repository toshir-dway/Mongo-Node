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
    const newAlert = new Alert(req.body);
    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// exports.updateAlert = async (req, res) => {
//   try {
//     const updatedAlert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedAlert) {
//       return res.status(404).json({ error: 'Alert not found' });
//     }
//     res.json(updatedAlert);
//   } catch (error) {
//     console.error('Error updating alert:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

exports.deleteAlert = async (req, res) => {
  try {
    const deletedAlert = await Alert.findByIdAndDelete(req.params.id);
    if (!deletedAlert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
