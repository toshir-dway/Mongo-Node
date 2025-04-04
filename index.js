require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { dbName: 'neighboralert' })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const alertsRouter = require('./routes/alerts');
const placesRouter = require('./routes/places');
app.use('/api/alerts', alertsRouter);
app.use('/api/places', placesRouter);

// Pages
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/ajouter-place', (req, res) => {
  res.render('add_place');
});

app.get('/ajouter-alerte', (req, res) => {
  res.render('add_alert');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});