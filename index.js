require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const alertsRouter = require('./routes/alerts');
const placesRouter = require('./routes/places');
app.use('/api/alerts', alertsRouter);
app.use('/api/places', placesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/ajouter-place', (req, res) => {
  res.render('add_place');
});

app.get('/ajouter-alerte', (req, res) => {
  res.render('add_alert');
});
app.use(express.urlencoded({ extended: true })); // for form submissions

