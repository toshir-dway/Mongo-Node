const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = 'neighboralert';
let alertsCollection;
let mongoClient; // Store the MongoClient instance

// Connexion unique à la collection Time Series "alerts"
MongoClient.connect(uri)
  .then(client => {
    mongoClient = client; // Store the client
    const db = client.db(dbName);
    alertsCollection = db.collection('alerts');
    console.log('✅ Connected to alerts Time Series collection');
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err);
  });

exports.alertsCollection = () => alertsCollection; // Export as a getter function
exports.mongoClient = () => mongoClient; // Export the MongoClient instance

// GET /api/alerts — lire toutes les alertes
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await alertsCollection.find({}).toArray();
    res.json(alerts);
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/alerts — créer une alerte
exports.createAlert = async (req, res) => {
  try {
    const data = req.body;

    // Forcer les champs requis
    data.createdAt = new Date();

    if (!data.expiresAt) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      data.expiresAt = expiresAt;
    }

    const result = await alertsCollection.insertOne(data);
    res.status(201).json({ ...data, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/alerts/:id — supprimer une alerte
exports.deleteAlert = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await alertsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
