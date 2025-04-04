const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: pointSchema,
    required: true
  },
  type: {
    type: String,
    enum: ['adresse', 'evenement'],
    default: 'adresse'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pour les coordonnées simples (temporaire, pour compatibilité)
placeSchema.virtual('lat').get(function() {
  return this.location.coordinates[1];
});

placeSchema.virtual('lng').get(function() {
  return this.location.coordinates[0];
});

module.exports = mongoose.model('Place', placeSchema);