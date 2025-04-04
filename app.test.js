const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const alertsRouter = require('./routes/alerts');
const placesRouter = require('./routes/places');
const Alert = require('./models/alert');
const Place = require('./models/place');

const app = express();
app.use(express.json());
app.use('/api/alerts', alertsRouter);
app.use('/api/places', placesRouter);

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  // Clean up the database and disconnect
  await Alert.deleteMany({});
  await Place.deleteMany({});
  await mongoose.connection.close();
});

describe('API Endpoints', () => {
  // Alerts Tests
  test('GET /api/alerts should return an array', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/alerts should create a new alert', async () => {
    const newAlert = {
      title: 'Test Alert',
      description: 'This is a test alert',
      location: {
        type: 'Point',
        coordinates: [45.764043, 4.835659] // Example coordinates
      },
      type: 'danger'
    };
    const res = await request(app).post('/api/alerts').send(newAlert);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newAlert.title);
    expect(res.body.location.type).toBe('Point');
    expect(res.body.location.coordinates).toEqual(newAlert.location.coordinates);
  });

  // Places Tests
  test('GET /api/places should return an array', async () => {
    const res = await request(app).get('/api/places');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/places should create a new place', async () => {
    const newPlace = {
      name: 'Test Place',
      description: 'This is a test place',
      location: {
        type: 'Point',
        coordinates: [48.856613, 2.352222] // Example coordinates
      },
      type: 'adresse'
    };
    const res = await request(app).post('/api/places').send(newPlace);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newPlace.name);
    expect(res.body.location.type).toBe('Point');
    expect(res.body.location.coordinates).toEqual(newPlace.location.coordinates);
  });
});