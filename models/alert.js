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

const alertSchema = new mongoose.Schema({
  title: {
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
    enum: ['danger', 'travaux', 'autre'],
    default: 'autre'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pour les coordonnées simples (temporaire, pour compatibilité)
alertSchema.virtual('lat').get(function() {
  return this.location.coordinates[1];
});

alertSchema.virtual('lng').get(function() {
  return this.location.coordinates[0];
});

module.exports = mongoose.model('Alert', alertSchema);